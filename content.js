console.log("YouTube Automation content script loaded");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.send === "tabCreated") {
    console.log("Tab was created successfully");
  }
});

chrome.runtime.sendMessage({ action: "contentScriptReady" });
