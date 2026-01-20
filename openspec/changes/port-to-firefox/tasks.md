# Implementation Tasks: Port to Firefox

## Phase 1: Manifest & Configuration

- [ ] 1.1 Create `public/manifest-firefox.json` with Firefox WebExtensions API configuration
  - Copy from `public/manifest.json` as base
  - Update permissions for Firefox compatibility
  - Ensure `manifest_version: 2` is set
  - Define `browser_action` object
  - Include all icon references

- [ ] 1.2 Create `extension-firefox/manifest.json` (built manifest template)
  - This will be generated during build
  - Ensure build process copies Firefox manifest to output

---

## Phase 2: Build System Updates

- [ ] 2.1 Update `scripts/build.js` to support `BROWSER=firefox` environment variable
  - Detect `process.env.BROWSER` value
  - Set output path to `extension-firefox/` when `firefox`
  - Load correct manifest based on browser target
  - Log which browser target is being built

- [ ] 2.2 Update `scripts/start.js` for Firefox development mode
  - Add `npm run dev:firefox` script to `package.json`
  - Support `BROWSER=firefox` environment variable
  - Output to `extension-firefox/` directory
  - Enable hot module reloading

- [ ] 2.3 Update webpack configuration to handle separate build outputs
  - Modify webpack config to accept browser parameter
  - Ensure correct paths for manifest and resources
  - Copy image assets to correct directory
  - Preserve existing Chrome build (default)

- [ ] 2.4 Update `package.json` npm scripts
  - Add `"build:firefox": "BROWSER=firefox npm run build"`
  - Add `"dev:firefox": "BROWSER=firefox npm start"`
  - Document new scripts in README

---

## Phase 3: Firefox Background Script

- [ ] 3.1 Create `extension-firefox/background.js`
  - Use `browser.*` API namespace (Firefox standard)
  - Implement message listener: `browser.runtime.onMessage.addListener()`
  - Handle extension lifecycle events
  - Ensure compatibility with existing message protocol

- [ ] 3.2 Verify background script functionality
  - Can receive messages from content scripts
  - Can send responses back to sender
  - Storage API calls work with `browser.storage.local`
  - No console errors on extension startup

---

## Phase 4: Extension Directory & Resources

- [ ] 4.1 Create `extension-firefox/` directory structure
  - Create folders: `extension-firefox/images/`, `extension-firefox/`
  - Copy all image assets: `reader16.png`, `reader32.png`, `reader48.png`, `reader128.png`
  - Verify all assets are in place

- [ ] 4.2 Create `extension-firefox/index.js` (popup entry point)
  - Copy and adapt from current `extension/index.js`
  - Ensure React app mounts correctly
  - Content scripts reference correct browser API

---

## Phase 5: Testing & Validation

- [ ] 5.1 Load Firefox extension in development
  - Open Firefox about:debugging
  - Load extension from `extension-firefox/` folder
  - Verify no permission warnings
  - Check extension appears in toolbar

- [ ] 5.2 Test core functionality on Firefox
  - **Speed reading mode**: Activate on article page, verify faded stop words
  - **Settings persistence**: Toggle reading mode, verify settings saved
  - **Article extraction**: Verify content is correctly parsed
  - **UI responsiveness**: Check popup window opens/closes without errors

- [ ] 5.3 Verify cross-tab communication
  - Test message passing between content script and background script
  - Verify popup can communicate with active tab
  - Check storage API for user preferences

- [ ] 5.4 Check browser console for errors
  - Run extension and check Firefox developer console (Ctrl+Shift+K)
  - Verify no security/CSP errors
  - Confirm all resources load (no 404s)

---

## Phase 6: Documentation & Integration

- [ ] 6.1 Update README with Firefox build instructions
  - Document `npm run build:firefox` usage
  - Add Firefox development mode instructions (`npm run dev:firefox`)
  - Include Firefox testing steps (about:debugging)
  - Note differences between Chrome and Firefox builds

- [ ] 6.2 Update `.gitignore` to include Firefox build output
  - Add `extension-firefox/` to `.gitignore` (or version control it, per preference)
  - Ensure no build artifacts are committed

- [ ] 6.3 Test full build-from-scratch
  - Clean previous builds
  - Run `npm install` to ensure dependencies
  - Run `npm run build` (Chrome) and verify output
  - Run `npm run build:firefox` and verify Firefox output
  - Confirm both extensions can be loaded simultaneously

---

## Phase 7: Final Integration (Optional - for separate PR)

- [ ] 7.1 Set up CI/CD for Firefox builds
  - Add Firefox build step to CI pipeline
  - Ensure both Chrome and Firefox builds are tested
  - Generate build artifacts for distribution

- [ ] 7.2 Prepare for Firefox Add-ons store submission (optional, separate PR)
  - Create Firefox Add-ons developer account
  - Prepare extension description and privacy policy
  - Submit to Firefox Add-ons store
  - Monitor review process

---

## Validation Checklist

Before marking complete, verify:

- [ ] `extension-firefox/manifest.json` is valid JSON and contains all required keys
- [ ] `npm run build:firefox` executes without errors
- [ ] `npm run dev:firefox` starts dev server and watches for changes
- [ ] Firefox can load extension from `extension-firefox/` folder
- [ ] Extension icon appears in Firefox toolbar
- [ ] Speed reading features work identically to Chrome version
- [ ] Settings persist across browser sessions
- [ ] No console errors (security or runtime)
- [ ] README documents Firefox usage
- [ ] Chrome build remains unaffected (`npm run build` still works)
