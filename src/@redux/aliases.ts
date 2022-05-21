import { Dispatch } from 'react';
import { AppState } from './index';

import { UserActionType } from './user/actions';

export const aliases = {
    /**
     * Receive Get User Action from Content Script
     *
     * @param originalAction
     * @returns
     */
    [UserActionType.GetUser]: (originalAction: any) => {
        return (dispatch: Dispatch<any>, getState: () => AppState) => {
            const { email } = originalAction.payload;
            dispatch({
                type: UserActionType.SetUser,
                payload: email,
            });
        };
    },
};
