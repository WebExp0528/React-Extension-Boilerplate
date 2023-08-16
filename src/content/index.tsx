/* global document */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { runtime } from 'webextension-polyfill';
import MessageListener from './messageListener';

// import "./content.css";

runtime.onMessage.addListener(MessageListener);

class Main extends React.Component {
    render() {
        return (
            <div className="my-extension">
                <h1>Hello world - My first Extension</h1>
            </div>
        );
    }
}

const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);
const root = ReactDOM.createRoot(app);
root.render(<Main />);
