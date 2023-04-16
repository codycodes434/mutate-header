import { Header, UserSettings } from "../user-settings";
import { applySettings, getSettings } from "../user-settings-helpers";
export {}

getSettings()
  .then((loadedSettings) => {
    if (loadedSettings?.default) {
        applySettings(JSON.parse(loadedSettings.default));
    }
  })
  .catch((err) => console.log(err));


const messageHandlers : Record<string, (value: any) => any> = {
  settingsUpdate: (value: UserSettings) => applySettings(value)
};

chrome.runtime.onMessage.addListener((message) => {
  const handler = messageHandlers[message.name];

  if (!handler) {
    console.log(`No handler for ${ message.name }`);
    return;
  }

  handler(message.value);
});

