chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startAutomation") {
    chrome.tabs.create({ url: "https://www.youtube.com" }, function (tab) {
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        console.log("Tab Update Info:", changeInfo.status);
        if (tabId === tab.id && changeInfo.status === "complete") {
          runYouTubeAutomation();
        }
      });
    });
  }
});

function runYouTubeAutomation() {}
