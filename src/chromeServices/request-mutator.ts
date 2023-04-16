import { UserSettings } from "../user-settings";
export {}

const getSettings = () => {
    return chrome.storage.local.get();
  };

let settings: UserSettings;

const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

const persistantRuleId = 1000;


const applySettings = (settings: UserSettings) => {
  const requestHeaders = [] as chrome.declarativeNetRequest.ModifyHeaderInfo[];

  if (settings.isActive) {
    settings.headers.forEach((header) => {
      requestHeaders.push({
        header: header.name, 
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value: header.value
      });
    });
  }

  if (requestHeaders.length) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: persistantRuleId,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders
        },
        condition: {
          resourceTypes: allResourceTypes,
        }
      }],
      removeRuleIds: [persistantRuleId]
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [persistantRuleId]
    });
  }
};


getSettings()
  .then((loadedSettings) => {
    if (loadedSettings?.default) {
        settings = JSON.parse(loadedSettings.default);
        applySettings(settings);
    }
  })
  .catch((err) => console.log(err));

chrome.runtime.onMessage.addListener((message) => {
    console.log("update", message);
    if (message.name === 'settingsUpdate') {
      applySettings(message.value);
    }
});

