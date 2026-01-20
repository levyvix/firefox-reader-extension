# Debugging the Reader Extension

## How to See Console Logs

### In Zen/Firefox Developer Tools:
1. **Open Developer Tools**: Press `F12` or `Ctrl+Shift+I`
2. **Go to Console tab**: Click on "Console"
3. **Filter by [Reader]**: Type `[Reader]` in the filter box to see only extension logs

### What to Look For:
When you click the extension button, you should see logs like:
```
[Reader] Starting componentWillMount
[Reader] Document cloned
[Reader] Readability parse completed: {title: "...", content: "..."}
[Reader] Initial state set
[Reader] Body styles applied
[Reader] componentDidMount called
```

## If Something Goes Wrong:

### Scenario 1: "something appears and disappears"
**What this means**: The UI is being shown but then gets removed

**How to debug**:
1. Click the extension button
2. Immediately open Developer Tools (F12)
3. Look for console messages with `[Reader]`
4. Look for red error messages
5. Screenshot the console and share with me

### Scenario 2: Nothing appears at all
**Check the following**:
1. Are there ANY `[Reader]` messages in the console?
2. Are there red errors in the console?
3. Check the "Network" tab in Developer Tools - are all files loading?

### Scenario 3: Error message shows instead of reader
**This is good!** It means error handling is working.
- Read the error message - it tells you what went wrong
- Share the full error message

## Getting Help

When reporting issues, include:
1. Screenshots of the console (F12 → Console)
2. The full error message
3. The URL of the page where you're testing
4. Which browser (Zen vs Firefox)

## Extension Files Location:
- **Built extension**: `/home/levi/Documents/projects/firefox-reader-extension/extension-firefox/`
- **Load in Zen/Firefox**: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → Select `manifest.json` from above folder
