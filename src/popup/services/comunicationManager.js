import browser from "webextension-polyfill";

export default function sendMessage(message, data) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const activeTab = tabs[0];
        browser.tabs.sendMessage(activeTab.id, { action: message, data });
    });
}
