import browser from "webextension-polyfill";

/**
 * MSG Types
 */
export const MSG_TYPE = {
    GET_INFO_BY_EMAIL: 10000001,
    SAVE_SIGNATURE: 10000002,
};

/**
 * gen message
 *
 * @param { keyof MSG_TYPE } msgType
 * @param { {[string]:any} } message
 */
const genMessage = (msgType, message) => {
    return {
        msgType,
        ...message,
    };
};

/**
 * Send Message to background script
 *
 * @param { keyof MSG_TYPE } msgType
 * @param { {[string]:any} } message
 */
export const sendMessage = async (msgType, message) => {
    try {
        console.log("===== Sending Message => ", msg);
        const res = await browser.runtime.sendMessage(genMessage(msgType, message));
        return res;
    } catch (e) {
        console.log("[===== Error in SendMessage =====]", e);
        return null;
    }
};

export const sendMessageToActiveTab = async (msgType, message) => {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];
        const res = await browser.tabs.sendMessage(activeTab.id, genMessage(msgType, message));
        return res;
    } catch (error) {
        console.log("[===== Error in sendMessageToActiveTab =====]", error);
        return null;
    }
};
