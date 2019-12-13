/* global browser, window, chrome */

const apis = [
  "alarms",
  "bookmarks",
  "browserAction",
  "commands",
  "contextMenus",
  "cookies",
  "downloads",
  "events",
  "extension",
  "extensionTypes",
  "history",
  "i18n",
  "idle",
  "notifications",
  "pageAction",
  "runtime",
  "storage",
  "tabs",
  "webNavigation",
  "webRequest",
  "windows"
];

function Extension() {
  const self = this;

  apis.forEach(api => {
    self[api] = null;

    try {
      if (chrome[api]) {
        self[api] = chrome[api];
      }
    } catch (e) {
      return;
    }

    try {
      if (window[api]) {
        self[api] = window[api];
      }
    } catch (e) {
      return;
    }

    try {
      if (browser[api]) {
        self[api] = browser[api];
      }
    } catch (e) {
      return;
    }

    try {
      self.api = browser.extension[api];
    } catch (e) {
      // I want application to not crush, but don't care about the message
    }
  });

  try {
    if (browser && browser.runtime) {
      this.runtime = browser.runtime;
    }
  } catch (e) {
    return;
  }

  try {
    if (browser && browser.browserAction) {
      this.browserAction = browser.browserAction;
    }
  } catch (e) {
    // I want application to not crush, but don't care about the message
  }
}

module.exports = new Extension();
