import { Runtime } from 'webextension-polyfill';

export const onRequest = async (
    msg: EXTMessage,
    sender: Runtime.SendMessageOptionsType
): Promise<EXTResponse | undefined> => {
    console.log('~~~~~~~', msg);
    try {
        switch (msg.type) {
            case 'CHANGE_COLOR': {
                document.body.style.background = msg?.data?.color;
                break;
            }
            default:
                return { type: 'SUCCESS' };
        }
    } catch (error) {
        throw error;
    }
};

export default onRequest;
