# Build System - Firefox Support

## ADDED Requirements

### Requirement: Firefox Build Target

The build system SHALL support creating Firefox-specific extension artifacts separate from Chrome builds.

#### Scenario: Build Firefox extension

- **WHEN** developer runs `npm run build:firefox`
- **THEN** webpack compiles React source and extension files
- **AND** output is written to `extension-firefox/` directory (parallel to `extension/`)
- **AND** Firefox-specific manifest is copied to output
- **AND** build completes without errors

#### Scenario: Development mode for Firefox

- **WHEN** developer runs `npm run dev:firefox`
- **THEN** webpack dev server starts with hot module reloading
- **AND** extension output goes to `extension-firefox/`
- **AND** developer can load extension from `extension-firefox/` in Firefox
- **AND** changes to source files trigger rebuild

#### Scenario: Default build remains Chrome-compatible

- **WHEN** developer runs `npm run build` (default)
- **THEN** output is written to `extension/` directory (existing Chrome build)
- **AND** Chrome manifest is used
- **AND** Firefox build is NOT generated
- **AND** existing Chrome workflow is unaffected

---

### Requirement: Manifest Processing

The build system SHALL manage Firefox-specific manifest transformations during build.

#### Scenario: Firefox manifest selection

- **WHEN** `BROWSER=firefox` environment variable is set during build
- **THEN** build system selects `public/manifest-firefox.json` instead of `public/manifest.json`
- **AND** selected manifest is copied to output extension directory
- **AND** manifest paths and resource references are adjusted if needed

#### Scenario: Web accessible resources

- **WHEN** extension is built for Firefox
- **THEN** all `web_accessible_resources` (icons, images) are correctly referenced
- **AND** file paths in manifest match actual output structure
- **AND** icons load without 404 errors when extension is running

#### Scenario: Image assets handling

- **WHEN** webpack processes extension build
- **THEN** image files from `extension/images/` are copied to `extension-firefox/images/`
- **AND** subdirectories are preserved
- **AND** all PNG icons (16, 32, 48, 128) are available in output

---

### Requirement: Development Experience

The build system SHALL provide smooth developer experience when working on Firefox builds.

#### Scenario: Build information logging

- **WHEN** build completes
- **THEN** console outputs indicate which browser target was built
- **AND** developer can confirm correct output (Chrome vs Firefox)

#### Scenario: Webpack configuration

- **WHEN** webpack runs with `BROWSER=firefox`
- **THEN** output filenames and paths are updated accordingly
- **AND** webpack does NOT create `extension/` when Firefox build is running
- **AND** vice versa: Chrome build does NOT touch `extension-firefox/`

#### Scenario: Hot reloading in dev mode

- **WHEN** source files change during `npm run dev:firefox`
- **THEN** webpack recompiles
- **AND** `extension-firefox/main.js` is updated
- **AND** developer can refresh extension in Firefox to see changes

---

### Requirement: Output Structure

The build system SHALL produce correctly structured Firefox extension artifacts.

#### Scenario: Firefox extension directory structure

- **WHEN** build completes for Firefox
- **THEN** `extension-firefox/` contains:
  - `manifest.json` (Firefox WebExtensions format)
  - `background.js` (Firefox background script)
  - `main.js` (compiled React + content script bundle)
  - `main.css` (compiled styles)
  - `index.js` (popup entry point)
  - `images/` directory with all PNG icons
- **AND** no Chrome-specific files are included
- **AND** directory structure mirrors `extension/` for consistency

#### Scenario: Build artifact cleanliness

- **WHEN** Firefox build completes
- **THEN** no build intermediate files (source maps, test outputs) are in `extension-firefox/`
- **AND** only production-ready files are present
- **AND** extension can be loaded directly into Firefox for testing

---

## MODIFIED Requirements

(None - build system additions do not modify existing Chrome build requirements)

## REMOVED Requirements

(None - Chrome build remains fully functional)
