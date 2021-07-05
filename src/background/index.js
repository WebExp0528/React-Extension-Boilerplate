import browser from "webextension-polyfill";

/**
 * Define background script functions
 * @type {class}
 */
class Background {
    constructor() {
        this.init();
    }

    /**
     * Document Ready
     *
     * @returns {void}
     */
    init = () => {
        console.log("[===== Loaded Background Scripts =====]");

        //When extension installed
        browser.runtime.onInstalled.addListener(this.onInstalled);

        //Add message listener in Browser.
        browser.runtime.onMessage.addListener(this.onMessage);

        //Add message listener from Long Live Connection
        browser.extension.onConnect.addListener(this.onConnect);

        //Add Update listener for tab
        browser.tabs.onUpdated.addListener(this.onUpdatedTab);

        //Add New tab create listener
        browser.tabs.onCreated.addListener(this.onCreatedTab);
    };

    //TODO: Listeners

    /**
     * Extension Installed
     */
    onInstalled = () => {
        console.log("[===== Installed Extension!] =====");
    };

    /**
     * Message Handler Function
     *
     * @param { object } message
     * @param { object } sender
     */
    onMessage = async (message, sender) => {
        try {
            console.log("[===== Received message =====]", message, sender);
            switch (message.type) {
            }
            return true; // result to reply
        } catch (error) {
            console.log("[===== Error in MessageListener =====]", error);
            return error;
        }
    };

    /**
     * Connect with Extension
     *
     * @param {*} port
     */
    onConnect = (port) => {
        this._port = port;
        console.log("[===== Connected Long Live Connection =====]");
        this._port.onMessage.addListener((msg) => this.onMessageFromExtension(msg));
    };

    /**
     * Message from Long Live Connection
     *
     * @param {*} msg
     */
    onMessageFromExtension = (msg) => {
        console.log("[===== Message from Long Live Connection =====]");
    };

    /**
     *
     * @param {object} tab
     */
    onCreatedTab = (tab) => {
        console.log("[===== New Tab Created =====]", tab);
    };

    /**
     * When changes tabs
     *
     * @param {*} tabId
     * @param {*} changeInfo
     * @param {*} tab
     */
    onUpdatedTab = (tabId, changeInfo, tab) => {
        console.log("[===== Tab Created =====]", tabId);
    };

    /**
     * Get url from tabId
     *
     * @param {number} tabId
     */
    getURLFromTab = async (tabId) => {
        try {
            const tab = await browser.tabs.get(tabId);
            return tab.url || "";
        } catch (error) {
            console.log(`[===== Could not get Tab Info$(tabId) in getURLFromTab =====]`, error);
            throw "";
        }
    };

    /**
     * Open new tab by url
     *
     * @param {string} url
     */
    openNewTab = async (url) => {
        try {
            const tab = await browser.tabs.create({ url });
            return tab;
        } catch (error) {
            console.log(`[===== Error in openNewTab =====]`, error);
            return null;
        }
    };

    /**
     * Close specific tab
     *
     * @param {number} tab
     */
    closeTab = async (tab) => {
        try {
            await browser.tabs.remove(tab.id);
        } catch (error) {
            console.log(`[===== Error in closeTab =====]`, error);
        }
    };

    /**
     * send message
     */
    sendMessage = async (tab, msg) => {
        try {
            const res = await browser.tabs.sendMessage(tab.id, msg);
            return res;
        } catch (error) {
            console.log(`[===== Error in sendMessage =====]`, error);
            return null;
        }
    };
}

export const background = new Background();
