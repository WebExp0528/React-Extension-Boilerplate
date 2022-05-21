import { combineReducers } from 'redux';
import { AppState } from './index';
import { initialState } from './initialState';

import user from './user';

const { ...emptyInitState } = initialState;

const createAppReducer = (initialState: AppState) => {
    const appReducer = combineReducers({
        user,
    });

    return (state = initialState, action: any) => {
        const nextState = appReducer(state, action);
        return nextState;
    };
};

export default createAppReducer;
