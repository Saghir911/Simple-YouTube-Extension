console.log("YouTube Automation content script loaded");

const S = {
  thumbnail: "#content ytd-thumbnail yt-image",
  subscribeBtn: "ytd-subscribe-button-renderer button",
  subscribeSpan: "ytd-subscribe-button-renderer button span",
  likeBtn: "like-button-view-model button",
  inputComment: "#contenteditable-root",
  commentBtn: "yt-button-shape button",
};

let homeHandled = false;
let videoHandled = false;
let clickDone = false;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Received:", msg.action);

  if (msg.action === "handleHomePage" && !homeHandled) {
    homeHandled = true;
    setTimeout(() => {
      const vid = document.querySelector(S.thumbnail);
      if (vid) {
        console.log("Clicking first thumbnail…");
        vid.click();
      } else {
        console.warn("No video thumbnail found");
      }
    }, 5000);
    sendResponse({ status: "homepage queued" });
  }

  if (msg.action === "handleVideoPage" && !videoHandled) {
    videoHandled = true;
    setTimeout(clickSubAndLike, 5000);
    sendResponse({ status: "video page queued" });
  }

  return true;
});

function clickSubAndLike() {
  if (clickDone) {
    console.log("Already processed this video—skipping.");
    return;
  }
  clickDone = true;
  console.log("Processing subscribe & like…");

  // Subscribe
  const btn = document.querySelector(S.subscribeBtn);
  const span = document.querySelector(S.subscribeSpan);
  if (btn && span && !/subscribed/i.test(span.textContent.trim())) {
    console.log("→ Subscribing");
    btn.click();
  } else {
    console.log("→ Already subscribed or button missing");
  }

  // Like
  const like = document.querySelector(S.likeBtn);
  if (like && like.getAttribute("aria-pressed") !== "true") {
    console.log("→ Liking");
    like.click();
  } else {
    console.log("→ Already liked or button missing");
  }

  //comment
  const inputComment = document.querySelector(S.inputComment);
  const commentBtn = document.querySelector(S.commentBtn);
  // if(window.document.style.overflow){
  //   console.log("its overflow");
  //   window.scrollY(20)
  // }
  if (inputComment) {
    console.log(inputComment+"found it");
    inputComment.click();
    inputComment.innerText = "Great Video";
  }
  else{
    console.log("Page is not compeltey loaded");
  }
  if (commentBtn && commentBtn.getAttribute("aria-label") === "Comment") {
    console.log("→ Commenting");
    commentBtn.click();
  } else {
    console.log("→ Comment button missing or aria-label is not 'Comment'");
  }

  // Close after 5s to let YouTube register clicks
  setTimeout(() => {
    console.log("Telling background to close tab");
    chrome.runtime.sendMessage({ action: "closeTab" });
  }, 7000);
}

// Notify background that content script is injected
chrome.runtime.sendMessage({ action: "contentScriptReady" });
