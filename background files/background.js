let activeTabId = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received message:", request);
  if (request.action === "startAutomation") {
    console.log("Creating YouTube tab...");
    chrome.tabs.create({ url: "https://www.youtube.com" }, function (tab) {
      activeTabId = tab.id;
      console.log("YouTube tab created with ID:", activeTabId);
    });
  }

  if (request.action === "contentScriptReady" && sender.tab) {
    console.log("Content script is ready in tab:", sender.tab.id);
  }

  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { send: "tabCreated" });
      runYouTubeAutomation();
    }, 1000);

    activeTabId = null;
  }
});

function runYouTubeAutomation() {
  console.log("Running YouTube automation");
}
