console.log("YouTube Automation content script loaded");

// Wait for the DOM to be fully loaded
console.log("DOM fully loaded");
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message);

  if (message.send === "tabCreated") {
    await delay(3000);

    const videoElement = document.querySelectorAll(
      "#content ytd-thumbnail yt-image"
    );

    if (videoElement.length > 0) {
      videoElement[1].click();
    } else {
      console.log("Video element not found");
    }
  }
  console.log("now time to subscribe");
  clickSub();
});
const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
function clickSub() {
  const sub = document.querySelector(
    ".yt-spec-button-shape-next__button-text-content"
  );
  console.log(sub);
  sub.click();
}

chrome.runtime.sendMessage({ action: "contentScriptReady" });
