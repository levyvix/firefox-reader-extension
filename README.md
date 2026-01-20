# Reeader - Minimal Reader with Speed Reading

Download Reeader for your browser:
- **Chrome**: [Reeader extension for Google Chrome](https://chrome.google.com/webstore/detail/reeader-minimal-reader-fo/jblbdklppkompnbobkpncbmbjkaeaeah)
- **Firefox**: Coming soon to Firefox Add-ons Store

![Chrome extensions tab](./screenshot.jpg)

## Running Extension in Development Mode

### Chrome

1. Enable developer mode in Google Chrome
2. Click on 'Load unpacked' and select the `extension/` folder
3. You can now use the extension on any website

![Chrome extensions tab](./screenshot1.png)

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the `extension-firefox/manifest.json` file
4. You can now use the extension on any website

## Development Environment Setup

Make sure you are in `dev` branch by running `git checkout dev`.

Run `npm install` to install dependencies. The source code is in the `src` folder and is powered by React.

### Building for Chrome

```bash
npm run build
```

This generates the production code in the `extension/` folder and refreshes the extension.

### Building for Firefox

```bash
npm run build:firefox
```

This generates the Firefox extension in the `extension-firefox/` folder.

### Development Mode

For Chrome:
```bash
npm start
```

For Firefox:
```bash
npm run dev:firefox
```

Both commands start the webpack dev server with hot module reloading.
