let activeTabId = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startAutomation") {
    chrome.tabs.create({ url: "https://www.youtube.com" }, function (tab) {
      activeTabId = tab.id;
      console.log("YouTube tab created with ID:", activeTabId);
    });
  }
  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    if (tab.url.includes("/watch")) {
      chrome.tabs.sendMessage(tabId, { action: "handleVideoPage" });
    } else {
      chrome.tabs.sendMessage(tabId, { action: "handleHomePage" });
    }
    activeTabId = null;
  }
});

// Handle SPA navigation
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  if (details.url.includes("/watch")) {
    chrome.tabs.sendMessage(details.tabId, { action: "handleVideoPage" });
  }
});
