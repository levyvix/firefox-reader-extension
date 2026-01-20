# Change: Port Reeader Extension to Firefox

## Why

Reeader is currently a Chrome-only extension (Manifest V2), which limits its audience. Firefox users represent a significant portion of the browser market, and Firefox has a robust WebExtensions API. Porting to Firefox enables:

1. **Market expansion** - Reach Firefox users who benefit from the fast reading features
2. **Firefox-first development** - Maintain compatibility with Firefox's stable WebExtensions API before Chrome's Manifest V3 migration
3. **Long-term compatibility** - Firefox's WebExtensions API is more stable than Chrome's rapid Manifest evolution

## What Changes

- **Manifest format**: Migrate from Chrome Manifest V2 → Firefox WebExtensions API manifest (v2 compatible with Firefox)
- **Background scripts**: Update to Firefox's event-driven model (persistent vs. non-persistent background scripts)
- **Content scripts**: Adjust permission model and API calls for Firefox compatibility
- **Build system**: Add Firefox-specific build output (separate extension folder)
- **Testing & validation**: Add Firefox-specific browser support to test suite

## Impact

- **Affected specs**:
  - `specs/browser-extension-api` (new) - Firefox WebExtensions API compatibility layer
  - `specs/build-system` (new) - Firefox build pipeline
- **Affected code**:
  - `extension/manifest.json` - New Firefox manifest
  - `public/manifest.json` - Base manifest (remains for Chrome, or can be parameterized)
  - Build scripts: `scripts/build.js`, `scripts/start.js`
  - Source code: `src/` (minimal changes, mostly manifest/permissions updates)
  - Extension structure: New `extension-firefox/` output directory

## Timeline

No specific deadline, but this should be implemented sequentially:
1. Manifest validation & API compatibility layer
2. Build system updates
3. Firefox-specific build output
4. Testing on Firefox
5. Distribution setup (Firefox Add-ons store)
