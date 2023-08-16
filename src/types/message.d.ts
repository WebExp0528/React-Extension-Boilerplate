// declare type EXTMessageType = 'CHANGE_COLOR';

declare type EXTMessage<T = any | boolean | string[]> = {
    type: string;
    data?: T;
};
