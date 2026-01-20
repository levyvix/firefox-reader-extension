# Design: Firefox Extension Port

## Context

Reeader is a React-based Chrome extension (Manifest V2) that provides distraction-free reading with speed-reading features. Firefox users need the same functionality, but Firefox requires different APIs and manifest structure than Chrome.

**Key constraints:**
- WebExtensions API is the standard for Firefox
- Firefox maintains backward compatibility with v2-like manifests (though discouraged)
- Build system currently targets Chrome's output structure
- No external state management (relies on React component state + browser storage)
- Must maintain feature parity with Chrome version

## Goals

**Goals:**
- Create fully-functional Firefox extension with feature parity
- Establish build process supporting Firefox distribution
- Enable future cross-browser support if desired
- Maintain single React codebase with minimal branching

**Non-Goals:**
- Cross-browser compatibility in this iteration (Firefox-only per user request)
- Manifest V3 migration (defer to separate effort)
- Breaking changes to existing Chrome extension
- Refactoring core React components

## Decisions

### Decision 1: Separate Build Output

**What:** Create separate `extension-firefox/` build output directory (parallel to existing Chrome `extension/`)

**Why:**
- Allows independent distribution to Firefox Add-ons store
- Keeps Chrome build unaffected during transition
- Enables future cross-browser support via unified npm build

**Alternatives considered:**
- Conditional manifest generation - Too complex; easier to maintain separate dirs
- Unified `extension/` with runtime detection - Risky; harder to debug

**Implementation:**
- Build script detects `BROWSER=firefox` env var
- Webpack output goes to `extension-firefox/` when flag is set
- Manifest is copied/transformed during build

---

### Decision 2: Shared React Code

**What:** Keep `src/` directory unchanged; use build-time manifest injection

**Why:**
- React components are browser-agnostic (use storage API which both support)
- Minimal source code changes required
- Easier maintenance and testing

**Manifest differences addressed at build time:**
- Permissions model (Firefox vs Chrome)
- Background script handling
- Icons and resource paths

---

### Decision 3: WebExtensions API Compatibility

**What:** Use standard WebExtensions API for all browser calls

**Why:**
- Firefox's native API; well-documented
- Superior to Manifest V2 for long-term stability
- API surface is ~85% shared between Chrome and Firefox

**Changes required in code:**
- Update background.js to use `browser.*` API (not `chrome.*`)
- Ensure storage calls use WebExtensions storage API
- Content scripts remain largely unchanged (both use `chrome.runtime.sendMessage`)

---

### Decision 4: Manifest Structure

**What:** Create `public/manifest-firefox.json` with Firefox-specific configuration

**Why:**
- Firefox manifest differs in permission names and structure
- Keeping separate allows clarity without complex conditionals
- Base manifest (`public/manifest.json`) remains for Chrome

**Key differences:**
- `manifest_version: 2` → stays same (WebExtensions use v2)
- `browser_action` → stays same (Firefox uses `browser_action`)
- `permissions` → Firefox requires different permission strings
- `background.scripts` → may differ in persistence handling

---

### Decision 5: Build System Updates

**What:** Extend npm scripts with `build:firefox` target

**What:**
```bash
npm run build:firefox  # Builds for Firefox
npm run build          # Builds for Chrome (default)
npm run dev:firefox    # Dev mode for Firefox
```

**Why:**
- Clear separation of concerns
- Easy to run both builds during development
- CI/CD can test both browsers

---

## Risks & Trade-offs

| Risk | Mitigation |
|------|------------|
| **API differences** - Firefox API diverges from Chrome | Use WebExtensions standard; test both; maintain API wrapper if needed |
| **Build complexity** - Two separate manifests/outputs | Clear naming convention; document in README; automate with env vars |
| **Testing burden** - Must test on Firefox | Set up Firefox test runner; use Playwright cross-browser testing |
| **Distribution complexity** - Different stores (Chrome Web Store vs Firefox Add-ons) | Handle in separate PR; document submission process |

---

## Migration Plan

### Phase 1: Manifest & Build Setup
1. Create `public/manifest-firefox.json`
2. Add `build:firefox` npm script
3. Update webpack to output to `extension-firefox/` when `BROWSER=firefox`

### Phase 2: Code Updates
1. Update `extension/background.js` → `extension-firefox/background.js` with Firefox API
2. Review content scripts for Firefox compatibility
3. Ensure storage API calls work on both browsers

### Phase 3: Testing
1. Load Firefox extension in development (about:debugging)
2. Test core features: reader activation, speed reading, settings persistence
3. Verify permissions and manifest loading

### Phase 4: Distribution (Optional; separate PR)
1. Set up Firefox Add-ons account
2. Prepare submission (privacy policy, screenshots, description)
3. Submit to Firefox Add-ons store

---

## Open Questions

1. **Should we maintain Chrome v2 or start planning Manifest V3 migration?**
   - Answer: Keep v2 for now; Manifest V3 is separate effort

2. **Do we want a monorepo structure or separate branches for Firefox?**
   - Answer: Single repo with browser-specific build outputs (cleaner)

3. **Will there be a second build artifact in CI/CD?**
   - Answer: Yes, `extension-firefox/` should be built and tested alongside `extension/`
