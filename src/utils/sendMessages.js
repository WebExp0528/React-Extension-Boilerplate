import ext from "./ext";
import { MSG_TYPE } from "./constant";

/**
 * MSG Types
 */
export const MSG_TYPE = {
    GET_INFO_BY_EMAIL: 10000001,
    SAVE_SIGNATURE: 10000002,
};

/**
 * Send Message to background script
 * @param { keyof MSG_TYPE } msgType
 * @param { {[string]:any} } message
 */
export const sendMessage = async (msgType, message) => {
    const msg = {
        msgType,
        ...message,
    };
    console.log("===== Sending Message => ", msg);
    return new Promise((resolve, reject) => {
        try {
            ext.runtime.sendMessage(msg, (response) => {
                resolve(response);
            });
        } catch (e) {
            console.log(" SendMessage Failed => ", e);
            reject(e);
        }
    });
};

export default sendMessage;
