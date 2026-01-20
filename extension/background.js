chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Add the reader container to the DOM
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['index.js']
    });

    // Inject styles
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['main.css']
    });

    // Inject reader script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['main.js']
    });
  } catch (error) {
    console.error('Error injecting scripts:', error);
  }
});
