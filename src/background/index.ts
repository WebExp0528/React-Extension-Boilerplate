import { runtime, tabs, Tabs, Runtime } from 'webextension-polyfill';
import localforage from 'localforage';

/**
 * Define background script functions
 * @type {class}
 */
class Background {
    _port: number;
    _blacklist: string[];

    constructor() {
        this.init();
        this._blacklist = [];
    }

    /**
     * Document Ready
     *
     * @returns {void}
     */
    init = () => {
        console.log('[===== Loaded Background Scripts =====]');

        //When extension installed
        runtime.onInstalled.addListener(this.onInstalled);

        //Add message listener in Browser.
        runtime.onMessage.addListener(this.onMessage);

        //Add Update listener for tab
        tabs.onUpdated.addListener(this.onUpdatedTab);

        //Add New tab create listener
        tabs.onCreated.addListener(this.onCreatedTab);
    };

    //TODO: Listeners

    /**
     * Extension Installed
     */
    onInstalled = () => {
        console.log('[===== Installed Extension!] =====');
    };

    /**
     * Message Handler Function
     *
     * @param message
     * @param message.type (get_blacklist | is_blacklisted | add_to_blacklist | remove_from_blacklist)
     * @param sender
     * @returns
     */
    onMessage = async (message: EXTMessage, sender: Runtime.MessageSender) => {
        try {
            console.log('[===== Received message =====]', message, sender);
            switch (message.type) {
                case 'get_blacklist':
                    const blacklist = await localforage.getItem('blacklist');
                    // @ts-ignore
                    this._blacklist = blacklist;
                    return {
                        type: 'SUCCESS',
                        data: this._blacklist,
                    };
                case 'is_blacklisted':
                    return {
                        type: 'SUCCESS',
                        data: this._blacklist.includes(message.data),
                    };
                case 'add_to_blacklist':
                    if (!this._blacklist.includes(message.data)) {
                        this._blacklist.push(message.data);
                        await localforage.setItem('blacklist', this._blacklist);
                        return {
                            type: 'SUCCESS',
                            data: this._blacklist,
                        };
                    }
                    return false;
                case 'remove_from_blacklist':
                    this._blacklist.splice(this._blacklist.indexOf(message.data), 1);
                    await localforage.setItem('blacklist', this._blacklist);
                    return {
                        type: 'SUCCESS',
                        data: this._blacklist,
                    };
                case 'set_blacklist':
                    this._blacklist = message.data;
                    await localforage.setItem('blacklist', message.data);
                    return {
                        type: 'SUCCESS',
                        data: this._blacklist,
                    };
                default:
                    return {
                        type: 'FAILED',
                        data: `Unknown Message Type: ${message.type}`,
                    };
            }
        } catch (error) {
            console.log('[===== Error in MessageListener =====]', error);
            return error;
        }
    };

    /**
     * Message from Long Live Connection
     *
     * @param msg
     */
    onMessageFromExtension = (msg: EXTMessage) => {
        console.log('[===== Message from Long Live Connection =====]');
    };

    /**
     *
     * @param tab
     */
    onCreatedTab = (tab: Tabs.Tab) => {
        console.log('[===== New Tab Created =====]', tab);
    };

    /**
     * When changes tabs
     *
     * @param {*} tabId
     * @param {*} changeInfo
     * @param {*} tab
     */
    onUpdatedTab = (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
        console.log('[===== Tab Updated =====]', tabId);
    };

    /**
     * Get url from tabId
     *
     */
    getURLFromTab = async (tabId: number) => {
        try {
            const tab = await tabs.get(tabId);
            return tab.url || '';
        } catch (error) {
            console.log(`[===== Could not get Tab Info$(tabId) in getURLFromTab =====]`, error);
            throw '';
        }
    };

    /**
     * Open new tab by url
     *
     */
    openNewTab = async (url: string) => {
        try {
            const tab = await tabs.create({ url });
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
    closeTab = async (tab: Tabs.Tab) => {
        try {
            await tabs.remove(tab.id ?? 0);
        } catch (error) {
            console.log(`[===== Error in closeTab =====]`, error);
        }
    };

    /**
     * send message
     */
    sendMessage = async (tab: Tabs.Tab, msg: EXTMessage) => {
        try {
            const res = await tabs.sendMessage(tab.id ?? 0, msg);
            return res;
        } catch (error) {
            console.log(`[===== Error in sendMessage =====]`, error);
            return null;
        }
    };
}

export const background = new Background();
