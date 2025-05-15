chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  // Example of tab activity tracker
  chrome.tabs.onActivated.addListener(({ tabId: _tabId }) => {
    // Save active tab and start timer
  });
  
  chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, _tab) => {
    // Handle title/url change
  });
  
  chrome.idle.onStateChanged.addListener((newState) => {
    if (newState === "idle") {
      // Pause tracking
    } else {
      // Resume tracking
    }
});
  