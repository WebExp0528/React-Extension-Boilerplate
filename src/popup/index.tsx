import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';

import Popup from './Popup';

const store = new Store();

const Index = () => (
    <Provider store={store}>
        <Popup />
    </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('display-container')!);

root.render(<Index />);
