let activeTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "startAutomation":
      chrome.tabs.create({ url: "https://www.youtube.com" }, (tab) => {
        activeTabId = tab.id;
        console.log(`YouTube tab created: ${activeTabId}`);
        setTimeout(() => {
          chrome.tabs.sendMessage(activeTabId, { action: "handleHomePage" });
        }, 2000);
      });
      break;

    case "contentScriptReady":
      console.log("Content script ready");
      break;

    case "closeTab":
      if (activeTabId !== null) {
        chrome.tabs.remove(activeTabId);
        console.log(`Closed tab ${activeTabId}`);
        activeTabId = null;
      }
      break;
  }
  return true; // keep channel open
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId !== activeTabId || changeInfo.status !== "complete") return;

  if (tab.url.includes("/watch")) {
    chrome.tabs.sendMessage(tabId, { action: "handleVideoPage" });
  } else if (tab.url.includes("youtube.com")) {
    chrome.tabs.sendMessage(tabId, { action: "handleHomePage" });
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.tabId === activeTabId && details.url.includes("/watch")) {
    setTimeout(() => {
      chrome.tabs.sendMessage(details.tabId, { action: "handleVideoPage" });
    }, 1000);
  }
});
