// // YouTube Automation Content Script

// // Listen for messages from the popup
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "startAutomation") {
//     // Run automation when message is received
//     runYouTubeAutomation();
//   }
// });

// // Main automation function
// function runYouTubeAutomation() {
//   console.log("YouTube Automation started");

//   // Check if we're on a YouTube video page
//   if (window.location.href.includes("youtube.com/watch")) {
//     // Like the video
//     autoLikeVideo();

//     // Subscribe to the channel
//     autoSubscribe();
//   } else {
//     console.log("Not on a YouTube video page");
//   }
// }

// // Function to automatically like videos
// function autoLikeVideo() {
//   // Find the like button
//   const likeButton = document.querySelector(
//     'ytd-toggle-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-text[aria-label^="Like"]'
//   );

//   if (likeButton) {
//     // Check if video is already liked
//     const isLiked =
//       likeButton.querySelector("#button").getAttribute("aria-pressed") ===
//       "true";

//     if (!isLiked) {
//       console.log("Liking video...");
//       likeButton.click();
//     } else {
//       console.log("Video already liked");
//     }
//   } else {
//     console.log("Like button not found");
//   }
// }

// // Function to automatically subscribe
// function autoSubscribe() {
//   // Find the subscribe button (unsubscribed state)
//   const subscribeButton = document.querySelector(
//     "ytd-subscribe-button-renderer tp-yt-paper-button"
//   );

//   if (subscribeButton) {
//     // Check if already subscribed
//     const isSubscribed = subscribeButton.getAttribute("subscribed") === "";

//     if (!isSubscribed) {
//       console.log("Subscribing to channel...");
//       subscribeButton.click();
//     } else {
//       console.log("Already subscribed to channel");
//     }
//   } else {
//     console.log("Subscribe button not found");
//   }
// }
