import { createStore, applyMiddleware } from 'redux';
import { alias } from 'webext-redux';
import createAppReducer from './rootReducer';
import thunk from 'redux-thunk';
import { aliases } from './aliases';
// @ts-ignore
/* eslint-disable */
export const createStoreInstance = (preloadedState) => {
    const appReducer = createAppReducer(preloadedState);

    const store = createStore(appReducer, preloadedState, applyMiddleware(alias(aliases), thunk));

    return store;
};

export default createStoreInstance(undefined);
