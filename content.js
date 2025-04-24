console.log("YouTube Automation content script loaded");

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.send === "tabCreated") {
    // Wait for the thumbnails to render
    await delay(3000);
    const videos = document.querySelectorAll("#content ytd-thumbnail yt-image");
    if (videos[1]) {
      videos[1].click();
    } else {
      console.log("Video element not found");
      return;
    }
  }

  // Give the page time to load the subscribe button
  await delay(5000);
  console.log("Now time to subscribe");
  clickSubAndLike();
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function clickSubAndLike() {
  const subButton = document.querySelector(
    "ytd-subscribe-button-renderer button"
  );

  if (!subButton) {
    console.log("Subscribe button not found or already subscribed");
  } else {
    console.log("Found subscribe button:", subButton);
    subButton.click();
  }

  const likeButton = document.querySelector("like-button-view-model button");

  if (!likeButton) {
    console.log("Like button not found or already liked");
  } else {
    console.log("Found like button:", likeButton);
    likeButton.click();
  }
}

chrome.runtime.sendMessage({ action: "contentScriptReady" });
