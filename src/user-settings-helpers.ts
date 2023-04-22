import { Header, UserSettings } from "./user-settings";

const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

const persistantRuleId = 1000;

const mapHeaderSettingToModifyHeaderInfo =  (header: Header) : chrome.declarativeNetRequest.ModifyHeaderInfo => ({
  header: header.name.trim(), 
  operation: chrome.declarativeNetRequest.HeaderOperation.SET,
  value: header.value
});


/**
 * Get the settings that are currently applied
 */
export const getSettings = () => chrome.storage.local.get();


/**
 * Saves the passed in settings for a given user. Currently, only a default profile is supported.
 * 
 * @param settings the settings to save for the user
 * 
 * @returns a promise that either resolves or rejects based upon if the settings save
 */
export const saveSettings = (settings: UserSettings) => {
    const settingsUpdate = { "default": JSON.stringify(settings) };
  
    return chrome.storage.local.set(settingsUpdate)
      .then(() => {
        return chrome.runtime.sendMessage({ name: "settingsUpdate", value: settings });
      })
      .catch((err) => console.log(err));
  };
  

/**
 * Takes in the provided UserSettings and converts them to rules that chrome applies on new reqests. 
 * 
 * This will wipe out any settings this function previously setup.
 * 
 * @param settings the setting to apply.
 */
export const applySettings = (settings: UserSettings) => {
    const requestHeaders = settings.isActive ? 
      settings.headers.map(mapHeaderSettingToModifyHeaderInfo) : 
      [] as chrome.declarativeNetRequest.ModifyHeaderInfo[];
  
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