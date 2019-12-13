<div align="center">
  <h1>
    Webpack React Extension Boilerplate  
  </h1>

  <p>
    <strong>Works for Chrome, Opera, Edge & Firefox.</strong>
  </p>
  <p>
  This plugin is higly inspired by extension-boilerplate (https://github.com/EmailThis/extension-boilerplate)
  </p>
</div>

## Features

<dl>
  <dt>Write in your favourite framework - React! :) </dt>
  <dd>
    Now you can create part of your exstensions in React framework - as you wish ;)
  </dd>
</dl>

<dl>
  <dt>Write once and deploy to Chrome, Opera, Edge & Firefox</dt>
  <dd>
    Based on WebExtensions. It also includes a tiny polyfill to bring uniformity to the APIs exposed by different browsers.
  </dd>
</dl>

<dl>
  <dt>Live-reload</dt>
  <dd>
    Your changes to CSS, HTML & JS files will be relayed instantly without having to manually reload the extension. This ends up saving a lot of time and improving the developer experience. Based on https://github.com/xpl/crx-hotreload
  </dd>
</dl>

<dl>
  <dt>Newest js technology stack</dt>
  <dd>
    You can use ES6, ES5.
  </dd>
</dl>

<dl>
  <dt>Comfortable styles import</dt>
  <dd>
    With react you can loas styles directy and you can use scss for styling.
  </dd>
</dl>

<dl>
  <dt>Easily configurable and extendable</dt>
  <dd>
    Project use webpack so you can easly customize your project depends on your needs. In config.json you can define source path for each browser (if needed - default it's the same source), destintantion and develop directory.
  </dd>
</dl>

<dl>
  <dt>Clean code</dt>
  <dd>
    Clean code is the best way for long term support for project. Boilerplate has fully configured eslint with airbnb styleguide.
  </dd>
</dl>

<dl>
  <dt>Test your components!</dt>
  <dd>
    Project use some library which support your testing proces. As test runner we use karma, as testing framework mocha. As support to assertion we use chai.
  </dd>
</dl>

## Installation

1. Clone the repository `git clone https://github.com/kamilogerto2/webpack-react-extension-boilerplate.git`
2. Run `npm install`
3. Run `npm run build`

##### Load the extension in Chrome & Opera

1. Open Chrome/Opera browser and navigate to chrome://extensions
2. Select "Developer Mode" and then click "Load unpacked extension..."
3. From the file browser, choose to `webpack-react-extension-boilerplate/dev/chrome` or (`wwebpack-react-extension-boilerplate/dev/opera`)

##### Load the extension in Firefox

1. Open Firefox browser and navigate to about:debugging
2. Click "Load Temporary Add-on" and from the file browser, choose `webpack-react-extension-boilerplate/dev/firefox`

##### Load the extension in Edge

https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/adding-and-removing-extensions

## Developing

The following tasks can be used when you want to start developing the extension and want to enable live reload -

- `npm run watch-dev`

## Packaging

Run `npm run build` to create a zipped, production-ready extension for each browser. You can then upload that to the appstore.

---

This project is licensed under the MIT license.

If you have any questions or comments, please create a new issue. I'd be happy to hear your thoughts.
