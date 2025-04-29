console.log("YouTube Automation content script loaded");

const videoThumbnail = "#content ytd-thumbnail yt-image";
const isSubscribed = "ytd-subscribe-button-renderer button span";
const subButton = "ytd-subscribe-button-renderer button ";
const likeBtn = "like-button-view-model button";
const likedButton = "button-view-model button";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.send === "tabCreated") {
    // Wait for the thumbnails to render
    await delay(3000);
    const videos = document.querySelectorAll(videoThumbnail);
    if (videos[0]) {
      videos[0].click();
    } else {
      console.log("Video element not found");
      return;
    }
  }

  await delay(5000);
  clickSubAndLike();
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function clickSubAndLike() {
  const subButtonElement = document.querySelector(subButton);
  const subscribed = document.querySelector(isSubscribed);
  if (!subButtonElement) {
    console.log("Subscribe button not found or already subscribed");
  } else {
    if (subscribed && subscribed.innerHTML === "Subscribed") {
      console.log("Already Subscribed: " + subscribed.innerHTML);
    } else {
      console.log("Found subscribe button:", subButtonElement);
      subButtonElement.click();
    }
  }

  const likeBtnElement = document.querySelector(likeBtn);
  const likedBtn = document.querySelector(likedButton);
  if (!likeBtnElement) {
    console.log("Like button not found or already liked");
  } else {
    if (likeBtn && likeBtn.title === "I like this") {
      console.log("Already Subscribed:" + likeBtn.title);
    } else {
      likeBtnElement.click();
    }
  }
}
// todo tayyab suggested:-
// function likeVideo() {
//   let likeBtn = document.querySelector("sdodos");
//   if (!likeBtn) return false;
//   likeBtn.click();
//   return true;
// }
chrome.runtime.sendMessage({ action: "contentScriptReady" });

let subscribed = document.querySelector("yt-core-attributed-string");
if (subscribed.innerHTML === "Subscribed" || subscribed.attributes.role === "subscribed") {
  console.log("subscribed: already subscribed hay");
} else {
  console.log("subscribe karo");
}
