import { UserSettings } from "../user-settings";

export {}

const urls = ["http://*/*", "https://*/*"];

const getSettings = () => {
    return chrome.storage.local.get();
  };

let settings: UserSettings;

getSettings()
  .then((loadedSettings) => {
    if (loadedSettings?.default) {
        settings = JSON.parse(loadedSettings.default);
    }
  })
  .catch((err) => console.log(err));

chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
});


const listener = (details: chrome.webRequest.WebRequestHeadersDetails) => {
    if (!settings) return;

    if (!settings.isActive) return;

    // If there is no name, we can't really add it either.
    const activeHeaders = settings.headers.filter((h) => h.isActive && h.name);

    for (const header of activeHeaders)
    {
        const { name, value } = header;

        details.requestHeaders?.push({ name, value });
    }
};


chrome.webRequest.onBeforeSendHeaders.addListener(listener, { urls }, [ 'requestHeaders' ]);