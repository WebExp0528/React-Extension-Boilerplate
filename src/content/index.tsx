/* global document */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { runtime } from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';

import MessageListener from './messageListener';

// import "./content.css";

const store = new Store();

runtime.onMessage.addListener(MessageListener);

const Main = () => {
    return (
        <Provider store={store}>
            <div className="my-extension">
                <h1>Hello world - My first Extension</h1>
            </div>
        </Provider>
    );
};

const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);
const root = ReactDOM.createRoot(app);
root.render(<Main />);
