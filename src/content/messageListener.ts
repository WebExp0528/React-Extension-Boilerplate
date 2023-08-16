import { Runtime } from 'webextension-polyfill';

export const onRequest = async (
    msg: EXTMessage,
    sender: Runtime.SendMessageOptionsType
): Promise<EXTResponse | undefined> => {
    console.log('~~~~~~~', msg);
    try {
        switch (msg.type) {
            default:
                return { type: 'FAILED', data: 'Unknown message type' };
        }
    } catch (error) {
        throw error;
    }
};

export default onRequest;
