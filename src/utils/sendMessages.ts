import { browser, Runtime, Tabs } from 'webextension-polyfill-ts';

/**
 * Send Message to Background Script
 *
 * @param msg
 * @returns
 */
export const sendMessage = (msg: EXTMessage, options?: Runtime.SendMessageOptionsType): Promise<EXTResponse> => {
    return browser.runtime.sendMessage(msg, options);
};

/**
 * Send Message to Content Script
 */
export const sendMessageToTab = <T = any>(
    tab: Tabs.Tab,
    msg: EXTMessage<T>,
    options?: Tabs.SendMessageOptionsType
): Promise<Response> => {
    return browser.tabs.sendMessage(tab.id as number, msg, options);
};

/**
 * Send Message to Content Script
 */
export const sendMessageToActiveTab = async <T = any>(
    msg: EXTMessage<T>,
    options?: Tabs.SendMessageOptionsType
): Promise<Response> => {
    let activeTab: Tabs.Tab;
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        activeTab = tabs[0];
    } catch (error) {
        console.log('[===== Error in sendMessageToActiveTab =====]', error);
        throw `Error in sendMessageToActiveTab`;
    }
    return sendMessageToTab(activeTab, msg, options);
};
