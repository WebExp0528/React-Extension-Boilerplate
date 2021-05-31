import browser from "webextension-polyfill";

/**
 * Define content script functions
 * @type {class}
 */
class Background {
    constructor() {
        this.init();
    }

    /**
     * Document Ready
     * @returns {void}
     */
    init = () => {
        console.log("loaded Background Scripts");

        //When extension installed
        browser.runtime.onInstalled.addListener(() => this.onInstalled());

        //Add message listener in Browser.
        browser.runtime.onMessage.addListener((message, sender, reply) =>
            this.onMessage(message, sender, reply)
        );

        //Add message listener from Extension
        browser.extension.onConnect.addListener((port) => this.onConnect(port));

        //Add Update listener for tab
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
            this.onUpdatedTab(tabId, changeInfo, tab)
        );

        //Add New tab create listener
        browser.tabs.onCreated.addListener((tab) => this.onCreatedTab(tab));
    };

    //TODO: Listeners

    /**
     * Extension Installed
     */
    onInstalled = () => {
        console.log("~~~~~Installed Extension!");
    };

    /**
     * Message Handler Function
     *
     * @param { object } message
     * @param { object } sender
     * @param { object } reply
     */
    onMessage = (message, sender, reply) => {
        console.log("~~~~~Received message", message);
        switch (message.type) {
        }
        return true;
    };

    /**
     * Connect with Extension
     *
     * @param {*} port
     */
    onConnect = (port) => {
        this._port = port;
        console.log("~~~~~Connected .....");
        this._port.onMessage.addListener((msg) =>
            this.onMessageFromExtension(msg)
        );
    };

    /**
     * Message from Extension
     *
     * @param {*} msg
     */
    onMessageFromExtension = (msg) => {
        console.log("~~~~Recieved message from Popup:" + msg);
    };

    /**
     *
     * @param {object} tab
     */
    onCreatedTab = (tab) => {
        console.log("~~~~~Created new tab", tab);
    };

    /**
     * When changes tabs
     *
     * @param {*} tabId
     * @param {*} changeInfo
     * @param {*} tab
     */
    onUpdatedTab = (tabId, changeInfo, tab) => {
        console.log("~~~~~Changed tab", tabId);
    };

    /**
     * get url from tab
     * @param {number} tabid
     */
    getURLFromTab = (tabid) => {
        return new Promise(function (resolve, reject) {
            browser.tabs.get(tabid, function (tab) {
                resolve(tab.url ? tab.url : "");
            });
        });
    };

    /**
     * open new tab
     *
     * @param {string} url
     */
    openNewTab = (url) => {
        return new Promise((resolve, reject) =>
            browser.tabs.create({ url }, function (tab) {
                resolve(tab);
            })
        );
    };

    /**
     * Close specific tab
     * @param {} tab
     */
    closeTab = (tab) => {
        return new Promise((resolve, reject) =>
            browser.tabs.remove(tab.id, () => {
                resolve();
            })
        );
    };

    /**
     * Update Tab
     */
    updateTab = (tab, options) => {
        return new Promise((resolve, reject) => {
            browser.tabs.update(tab.id, options, function (updateTab) {
                resolve(updateTab);
            });
        });
    };

    /**
     * Get info from tabId
     */
    getTab = (tab) => {
        return new Promise((resolve) => {
            browser.tabs.get(tab.id, function (newTab) {
                resolve(newTab);
            });
        });
    };

    /**
     * send message
     */
    sendMessage = (tab, msg) => {
        return new Promise((resolve, reject) =>
            browser.tabs.sendMessage(tab.id, msg, function (response) {
                resolve(response);
            })
        );
    };
}

export const background = new Background();
