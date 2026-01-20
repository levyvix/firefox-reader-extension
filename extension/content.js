// Content script that runs on all pages
// This bridges communication between the injected scripts and the extension

// Listen for messages from injected scripts (page scripts)
window.addEventListener('message', (event) => {
  // Only accept messages from our own page
  if (event.source !== window) return;

  if (event.data.type && event.data.type === 'READER_REQUEST') {
    // Forward storage requests to the background script
    if (event.data.action === 'storage.get') {
      browser.storage.sync.get(event.data.keys, (result) => {
        window.postMessage({
          type: 'READER_RESPONSE',
          id: event.data.id,
          data: result
        }, '*');
      });
    } else if (event.data.action === 'storage.set') {
      browser.storage.sync.set(event.data.data, () => {
        window.postMessage({
          type: 'READER_RESPONSE',
          id: event.data.id,
          data: { success: true }
        }, '*');
      });
    } else if (event.data.action === 'runtime.getURL') {
      const url = browser.runtime.getURL(event.data.path);
      window.postMessage({
        type: 'READER_RESPONSE',
        id: event.data.id,
        data: url
      }, '*');
    }
  }
});

// Inject a helper script into the page that provides chrome API compatibility
const script = document.createElement('script');
script.textContent = `
(function() {
  let requestId = 0;
  const pendingRequests = {};

  // Create a chrome object that the page can use
  window.chrome = window.chrome || {};
  window.chrome.storage = window.chrome.storage || {};
  window.chrome.storage.sync = {
    get: function(keys, callback) {
      requestId++;
      const id = requestId;
      pendingRequests[id] = callback;
      window.postMessage({
        type: 'READER_REQUEST',
        id: id,
        action: 'storage.get',
        keys: keys
      }, '*');
    },
    set: function(data, callback) {
      requestId++;
      const id = requestId;
      if (callback) pendingRequests[id] = callback;
      window.postMessage({
        type: 'READER_REQUEST',
        id: id,
        action: 'storage.set',
        data: data
      }, '*');
    }
  };

  window.chrome.runtime = {
    getURL: function(path) {
      requestId++;
      const id = requestId;
      // Use synchronous request for getURL (it's called during render)
      let result = '';
      const handler = (event) => {
        if (event.data.type === 'READER_RESPONSE' && event.data.id === id) {
          result = event.data.data;
          window.removeEventListener('message', handler);
        }
      };
      window.addEventListener('message', handler);
      window.postMessage({
        type: 'READER_REQUEST',
        id: id,
        action: 'runtime.getURL',
        path: path
      }, '*');
      // Wait a bit for response (blocking but necessary for sync call)
      const startTime = Date.now();
      while (!result && Date.now() - startTime < 100) {
        // Busy wait
      }
      return result;
    }
  };

  // Listen for responses
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.type === 'READER_RESPONSE') {
      const callback = pendingRequests[event.data.id];
      if (callback) {
        delete pendingRequests[event.data.id];
        callback(event.data.data);
      }
    }
  });
})();
`;
document.documentElement.appendChild(script);
script.remove();
