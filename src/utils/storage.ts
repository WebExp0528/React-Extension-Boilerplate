import { browser } from 'webextension-polyfill-ts';

export default browser.storage.sync ? browser.storage.sync : browser.storage.local;
