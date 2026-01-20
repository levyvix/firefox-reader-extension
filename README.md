# Reeader - Minimal Reader with Speed Reading

A lightweight Firefox and Chrome extension that extracts article content for distraction-free reading with speed reading and typography controls.

## Installation

### Chrome (Web Store)

Download Reeader from the Chrome Web Store:
- **[Reeader extension for Google Chrome](https://chrome.google.com/webstore/detail/reeader-minimal-reader-fo/jblbdklppkompnbobkpncbmbjkaeaeah)**

### Firefox (Development/Manual Installation)

Firefox version is currently available only via manual installation:

1. **Download the latest release**:
   - Go to [Releases](https://github.com/levyvix/firefox-reader-extension/releases)
   - Download the `extension-firefox.zip` from the latest version
   - Extract the zip file

2. **Install in Firefox**:
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`
   - Click **"Load Temporary Add-on..."**
   - Navigate to the extracted folder and select **`manifest.json`**
   - The extension is now installed

3. **Using the extension**:
   - Click the Reeader icon in your Firefox toolbar while reading an article
   - Adjust text size, line height, font weight, and theme as needed
   - Use speed reading mode for faster comprehension

**Note**: Temporary add-ons in Firefox are uninstalled on browser restart. For permanent installation, the extension needs to be submitted to Mozilla Add-ons store.

### Chrome (Manual Installation from Source)

1. **Build the extension**:
   ```bash
   npm install
   npm run build
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (top right corner)
   - Click **Load unpacked**
   - Select the `extension/` folder from the project

![Chrome extensions tab](./screenshot.jpg)

## Features

- **Distraction-free reading**: Removes ads, sidebars, and navigation elements
- **Typography controls**:
  - Adjustable font size (A+/A- buttons)
  - Line height adjustment for comfortable reading
  - Bold/normal font weight toggle
- **Speed reading mode**: Highlight key words to improve reading speed and comprehension
- **Theme selection**: Choose between light, sepia, and dark themes
- **Smart content extraction**: Uses Mozilla's Readability algorithm to identify article content
- **Cross-platform**: Works on Chrome and Firefox

## Latest Changes (v1.2.1)

✅ **Fixed article truncation** - Articles no longer get cut off at the end
- Improved content preservation for photo captions and trailing paragraphs
- Some websites with unusual layouts may still have limitations (this is expected)

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
