import browser from "webextension-polyfill";

export default browser.storage.sync ? browser.storage.sync : browser.storage.local;
