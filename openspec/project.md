# Project Context

## Purpose
Reeader is a minimal browser extension that enables faster article reading with speed-reading features. It extracts article content and presents it in a distraction-free interface with features like faded stop words and adjustable font weights to improve reading speed. Currently a Chrome extension (Manifest V2) being ported to Firefox.

**Core Features:**
- Minimal, distraction-free reader interface
- Fast reading mode with faded stop words
- Adjustable typography (variable font weights)
- Toggle controls for reading preferences
- Article content extraction and formatting

## Tech Stack
- **Language**: JavaScript / JSX (React)
- **Framework**: React 16.6.3
- **Build Tool**: Webpack 4.41.5
- **Transpiler**: Babel 7 with react-app preset
- **Styling**: CSS with SASS support
- **Testing**: Jest with jsdom
- **Browser API**: Chrome Extensions API (Manifest V2) → Firefox WebExtensions API (planned)
- **Package Manager**: npm

## Project Conventions

### Code Style
- **Format**: Follows create-react-app ESLint configuration (`react-app`)
- **Linting**: ESLint with plugins for React, JSX a11y, imports, and flowtype
- **Naming**: camelCase for variables/functions, PascalCase for components
- **File Organization**:
  - Components: `src/component/`
  - Helpers: `src/helpers/`
  - Libraries: `src/libs/`
  - Styles: CSS modules and regular CSS
  - Tests: Colocated with source files (`*.test.js`, `*.spec.js`)

### Architecture Patterns
- **Component-based**: React functional components with state management
- **Extension structure**:
  - `public/manifest.json` - Extension metadata
  - `extension/manifest.json` - Built extension manifest
  - Background scripts for extension lifecycle
  - Content scripts injected into web pages
- **Build process**: npm scripts for development and production builds
- **No external state management**: Uses React component state for UI controls

### Testing Strategy
- **Framework**: Jest with jsdom environment
- **Coverage**: Configured to collect coverage from `src/**/*.{js,jsx,ts,tsx}`
- **Test location**: Colocated with components (`__tests__` directories or `.test.js` files)
- **Node modules**: JSDOM test environment for DOM API support

### Git Workflow
- **Branches**: `dev` for development, `master` for production
- **Commit format**: Conventional commits (feat:, fix:, chore:, refactor:, etc.)
- **PRs**: Used for feature merges with PR descriptions
- **Examples from history**:
  - `chore: increased paragraph margin`
  - `feat: fast reading mode with faded stop words`
  - `fix: eslint warnings`

## Domain Context

**Browser Extension Architecture:**
- Extensions run in a sandboxed environment with limited API access
- Content scripts run in page context; background scripts run in extension context
- Data persistence via storage API (not localStorage)
- Security: No inline scripts; external scripts only

**Reading Speed Optimization:**
- Stop words (common filler words) are visually de-emphasized to improve scanning
- Variable font weight helps readers identify important words faster
- Minimal UI reduces cognitive load while reading

**Current Platform (Chrome):**
- Manifest V2 (deprecated but still supported)
- Browser action (popup UI)
- Active tab permission required
- Storage API for user preferences

**Planned Platform (Firefox):**
- Will require migration to Manifest V3 or Firefox WebExtensions API
- Different API naming conventions
- Different permission model

## Important Constraints

- **Browser Compatibility**: Currently Chrome-only (V2 manifest); Firefox port requires API adaptation
- **Manifest V2 Deprecated**: Chrome phasing out Manifest V2; will need upgrade for longevity
- **Content Extraction**: Must handle varied HTML structures across different websites
- **Storage Limits**: Browser extension storage quotas differ per browser
- **No External Dependencies in Content Scripts**: Security restrictions limit libraries that can run in content scripts
- **Build Output**: Must produce valid extension structure for both browser formats

## External Dependencies

- **Chrome Web Store**: Current distribution platform
- **Firefox Add-ons Store**: Planned distribution platform
- **React HTML Parser** (`react-html-parser`): For parsing article HTML content
- **Babel/Webpack**: Development toolchain, not runtime dependencies
