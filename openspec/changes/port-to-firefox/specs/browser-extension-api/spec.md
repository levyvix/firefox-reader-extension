# Browser Extension API Support - Firefox

## ADDED Requirements

### Requirement: Firefox WebExtensions API Compatibility

The extension SHALL support the Firefox WebExtensions API, enabling Reeader to run as a native Firefox add-on with full feature parity to the Chrome version.

#### Scenario: Background script initialization

- **WHEN** Firefox loads the extension
- **THEN** background script initializes using Firefox's `browser.*` API namespace
- **AND** browser action (popup button) is registered and functional

#### Scenario: Message passing between content and background scripts

- **WHEN** content script sends a message via `browser.runtime.sendMessage()`
- **THEN** background script receives and processes the message
- **AND** response is returned to content script

#### Scenario: Storage API compatibility

- **WHEN** extension saves user preferences (speed reading mode, font weight, etc.)
- **THEN** data persists using Firefox's `browser.storage.local` API
- **AND** settings are retained across browser sessions

#### Scenario: Permissions handling

- **WHEN** extension is installed on Firefox
- **THEN** required permissions are declared in manifest
- **AND** no permission warnings about insufficient privileges are raised
- **AND** user grants required permissions (activeTab, storage) during installation

#### Scenario: Icon and resource loading

- **WHEN** browser loads extension UI
- **THEN** all icons from `images/` directory load correctly
- **AND** manifest `web_accessible_resources` correctly references image files
- **AND** no console errors about missing resources

---

### Requirement: Content Script Execution

The extension SHALL inject and execute content scripts on target web pages, enabling the reader to extract and format article content.

#### Scenario: Content script injection on page load

- **WHEN** user navigates to a website with article content
- **THEN** content script is injected into page context
- **AND** `browser.runtime.onMessage` listener is active in content script
- **AND** no CSP (Content Security Policy) violations occur

#### Scenario: DOM manipulation and text extraction

- **WHEN** content script processes page HTML
- **THEN** article content is extracted and parsed without errors
- **AND** React HTML parser library functions correctly in content script context
- **AND** extracted text is sent to background script for processing

#### Scenario: User interaction from content script

- **WHEN** user clicks the Reeader button in browser toolbar
- **THEN** popup window opens showing extracted article
- **AND** content script can communicate article data to popup window

---

### Requirement: Manifest V2 Compatibility (Firefox WebExtensions)

The extension SHALL use a Firefox-compatible WebExtensions manifest (v2 format) that declares permissions, background scripts, content scripts, and icons correctly.

#### Scenario: Manifest structure validation

- **WHEN** Firefox loads `manifest.json` from extension folder
- **THEN** manifest has required keys:
  - `"manifest_version": 2`
  - `"name"`, `"version"`, `"description"`
  - `"permissions"` array with required APIs
  - `"background"` with script reference
  - `"browser_action"` object
  - `"icons"` mapping sizes to image paths
- **AND** no manifest validation errors are logged

#### Scenario: Permission declaration

- **WHEN** manifest declares permissions
- **THEN** required permissions include:
  - `"activeTab"` (to read current page content)
  - `"storage"` (to save user preferences)
  - `"<all_urls>"` or specific `http://*/` and `https://*/` (to inject content scripts)
- **AND** Firefox does not raise security warnings during installation

---

## MODIFIED Requirements

(None - all requirements are additions for Firefox support)

## REMOVED Requirements

(None - Chrome functionality remains)
