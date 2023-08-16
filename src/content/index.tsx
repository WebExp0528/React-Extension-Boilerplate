/* global document */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { runtime } from 'webextension-polyfill';
import MessageListener from './messageListener';
import { recipe_selectors } from 'utils/common';
import { RecipeModal } from 'components/RecipeModal';
import 'utils/style.scss';
import { sendMessage } from 'utils/sendMessages';

runtime.onMessage.addListener(MessageListener);

class Main extends React.Component {
    state = {
        blacklist: [],
        is_blacklisted: true,
    };

    getBlacklist = async () => {
        const blacklist = await sendMessage({ type: 'get_blacklist' });
        console.log('content: blacklist');
        this.setState({
            ...this.state,
            blacklist,
            is_blacklisted: blacklist.data.includes(document.location.hostname),
        });
    };

    isVisible = (): boolean => {
        return recipe_selectors.some((e) => document.querySelector(e));
    };
    componentDidMount() {
        this.getBlacklist();
    }

    render() {
        return (
            <>
                {!this.state.is_blacklisted && this.isVisible() ? (
                    <RecipeModal isVisible={!this.state.is_blacklisted} />
                ) : (
                    ''
                )}
            </>
        );
    }
}

const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);
const root = ReactDOM.createRoot(app);
root.render(<Main />);
