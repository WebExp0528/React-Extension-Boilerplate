import { useSelector } from 'react-redux';

import { initialState } from './initialState';

export type AppState = typeof initialState;

export const useRedux = <K extends keyof AppState>(key: K) => useSelector((state: AppState) => state[key]);
