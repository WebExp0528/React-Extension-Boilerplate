import browser from "webextension-polyfill";

module.exports = browser.storage.sync
    ? browser.storage.sync
    : browser.storage.local;
