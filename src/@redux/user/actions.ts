import { Dispatch } from 'react';

import { User } from './types';

export type UserAction = {
    type: UserActionType;
    payload?: User;
};

export enum UserActionType {
    // Call GetUser Action to Background Script
    GetUser = 'alias@GET_USER',
    SetUser = 'SET_USER',
}

/**
 * Get User Info
 *
 * @param dispatch
 */
export const get = (dispatch: Dispatch<UserAction>) => {
    dispatch({
        type: UserActionType.GetUser,
        payload: {
            email: 'test@gmail.com',
        },
    });
};
