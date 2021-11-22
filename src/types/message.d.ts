declare type EXTMessageType = 'CHANGE_COLOR';

declare type EXTMessage<T = any> = {
    type: EXTMessageType;
    data?: T;
};
