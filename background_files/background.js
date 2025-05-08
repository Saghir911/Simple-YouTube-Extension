let activeTabId = null;
let contentScriptReadyTabs = new Set();

const sendMessageToTab = (tabId, action) => {
  chrome.tabs.sendMessage(tabId, { action }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn("sendMessage error:", chrome.runtime.lastError.message);
    } else {
      console.log("Message sent to content script:", response);
    }
  });
};

chrome.runtime.onMessage.addListener((request, sender) => {
  switch (request.action) {
    case "startAutomation":
      chrome.tabs.create({ url: "https://www.youtube.com" }, (tab) => {
        activeTabId = tab.id;
        console.log(`YouTube tab created: ${activeTabId}`);
        const waitForContentScript = () => {
          if (contentScriptReadyTabs.has(activeTabId)) {
            sendMessageToTab(activeTabId, "handleHomePage");
          } else {
            setTimeout(waitForContentScript, 500);
          }
        };
        waitForContentScript();
      });
      break;

    case "contentScriptReady":
      if (sender.tab?.id !== undefined) {
        contentScriptReadyTabs.add(sender.tab.id);
        console.log(`Content script ready in tab ${sender.tab.id}`);
      } else {
        console.log("Content script ready from unknown sender");
      }
      break;

    case "closeTab":
      if (activeTabId !== null) {
        chrome.tabs.remove(activeTabId);
        console.log(`Closed tab ${activeTabId}`);
        contentScriptReadyTabs.delete(activeTabId);
        activeTabId = null;
      }
      break;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tabId === activeTabId &&
    changeInfo.status === "complete" &&
    contentScriptReadyTabs.has(tabId)
  ) {
    const action = tab.url.includes("/watch")
      ? "handleVideoPage"
      : tab.url.includes("youtube.com")
      ? "handleHomePage"
      : null;
    if (action) sendMessageToTab(tabId, action);
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (
    details.tabId === activeTabId &&
    details.url.includes("/watch") &&
    contentScriptReadyTabs.has(details.tabId)
  ) {
    setTimeout(() => sendMessageToTab(details.tabId, "handleVideoPage"), 1000);
  }
});
