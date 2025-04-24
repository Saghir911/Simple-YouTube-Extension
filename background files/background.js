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

// Add the onUpdated listener only once
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tabId,
        { send: "tabCreated" },
        function (response) {
          if (chrome.runtime.lastError) {
            console.log(
              "Error sending message:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("Message sent successfully");
          }
        }
      );
      runYouTubeAutomation();
    }, 1000);

    // Optional: reset activeTabId to prevent repeated execution
    activeTabId = null;
  }
});

function runYouTubeAutomation() {
  console.log("Running YouTube automation");
}
