chrome.runtime.sendMessage({ action: "contentScriptReady" });
console.log("YouTube Automation content script loaded");

// Original selectors - keeping these as they were
const S = {
  thumbnail: "#content ytd-thumbnail yt-image",
  subscribeBtn: "ytd-subscribe-button-renderer button",
  subscribeSpan: "ytd-subscribe-button-renderer button span",
  likeBtn: "like-button-view-model button",
  inputComment: "#placeholder-area",
  inputValue: "#contenteditable-root",
  commentBtn: "yt-button-shape button",
};

// State tracking
let homeHandled = false;
let videoHandled = false;
let clickDone = false;
let commentDone = false; // New flag to track if commenting has been done

// Message listener from background script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Received:", msg.action);

  if (msg.action === "handleHomePage" && !homeHandled) {
    homeHandled = true;
    setTimeout(() => clickFirstThumbnail(), 1000); // Delay to ensure page is loaded
    sendResponse({ status: "homepage queued" });
  }

  if (msg.action === "handleVideoPage" && !videoHandled) {
    videoHandled = true;
    setTimeout(() => processVideoPage(), 1000); // Delay to ensure page is loaded
    sendResponse({ status: "video page queued" });
  }

  return true; // Keep the message channel open
});

// Simple wait function
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Click the first thumbnail to go to a video
async function clickFirstThumbnail() {
  try {
    console.log("Looking for video thumbnail...");
    // Wait for the page to fully load first
    await wait(2000);

    const vid = document.querySelector(S.thumbnail);
    if (vid) {
      console.log("Clicking first thumbnail...");
      vid.click();

      // No longer calling processVideoPage() here
      // The message handler will do that after navigation
    } else {
      console.warn("No video thumbnail found");
    }
  } catch (error) {
    console.error("Error clicking thumbnail:", error);
  }
}

// Process a video page (subscribe, like, comment)
async function processVideoPage() {
  try {
    console.log("Processing video page...");
    await wait(3000); // Wait for video page to fully load

    // Subscribe and like
    await clickSubAndLike();

    // Scroll down to comments
    await scrollToComments();

    // Fetch & post the comment in one go
    await GetCommentText(videoURL, cleanTitle);

    // Close tab after everything is done
    await wait(5000);
    closeTab();
  } catch (error) {
    console.error("Error processing video page:", error);
  }
}

// Handle subscribe and like buttons
async function clickSubAndLike() {
  if (clickDone) {
    console.log("Already processed this video—skipping.");
    return;
  }

  clickDone = true;
  console.log("Processing subscribe & like...");

  // Subscribe
  const btn = document.querySelector(S.subscribeBtn);
  const span = document.querySelector(S.subscribeSpan);

  if (btn && span && !/subscribed/i.test(span.textContent.trim())) {
    console.log("→ Subscribing");
    btn.click();
    await wait(2000); // Wait after subscribing
  } else {
    console.log("→ Already subscribed or button missing");
  }

  // Like - fixed to better find and click the like button
  try {
    const likeBtn = document.querySelector(S.likeBtn);
    if (likeBtn && likeBtn.getAttribute("aria-pressed") !== "true") {
      console.log("→ Liking");
      likeBtn.click();
      await wait(2000); // Wait after liking
    } else {
      console.log("→ Already liked or button missing");
    }
  } catch (error) {
    console.error("Error liking video:", error);
  }

  await wait(2000); // Wait before next action
}

// Scroll down to make comments visible
async function scrollToComments() {
  console.log("Scrolling to comments section...");

  // Scroll down in increments
  for (let i = 0; i < 3; i++) {
    window.scrollBy(0, 100);
    await wait(500);
  }
}

// Add a comment to the video
async function customComment(aiComment) {
  if (commentDone) {
    console.log("Comment already added—skipping.");
    return;
  }

  try {
    console.log("Attempting to add comment...");

    // Click on comment input area
    const inputComment = document.querySelector(S.inputComment);
    if (inputComment) {
      console.log("Comment input area found, clicking...");
      inputComment.click();
      await wait(2000); // Wait for comment box to expand

      // Enter comment text
      const inputValue = document.querySelector(S.inputValue);
      if (inputValue) {
        console.log("Setting comment text...");
        inputValue.innerText = aiComment;
        // todo: for custom comment use this line below 👇
        // inputValue.innerText = "Great Video 👍";

        // Dispatch input event to trigger the comment button
        inputValue.dispatchEvent(new Event("input", { bubbles: true }));
        await wait(1500);

        // Find and click the comment button
        const commentBtns = document.querySelectorAll(S.commentBtn);
        let commentBtn = null;

        // Find button with "Comment" aria-label
        for (const btn of commentBtns) {
          if (btn.getAttribute("aria-label") === "Comment") {
            commentBtn = btn;
            break;
          }
        }

        if (commentBtn) {
          console.log("→ Submitting comment");
          commentBtn.click();
          commentDone = true; // Mark comment as done
          await wait(3000); // Wait for comment to be posted
        } else {
          console.log("→ Comment button not found with aria-label 'Comment'");
        }
      } else {
        console.log("Comment input value field not found");
      }
    } else {
      console.log("Comment input area not found");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

const cleanTitle = document.title.replace(" - YouTube", "").trim();
const videoURL = window.location.href;
async function GetCommentText(videoUrl, prompt) {
  try {
    console.log(videoUrl, prompt);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Generate a natural and engaging YouTube comment 10-15 words based on the given video title. The comment should sound like a real person, be relevant to the title, and feel authentic. Avoid generic AI-like responses. Here’s the video title: ${prompt}. Give only the comment as the output.`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    let commentFromAi = (data?.choices?.[0]?.message?.content).replace(
      /^"(.*)"$/,
      "$1"
    );
    if (commentFromAi) {
      console.log(`Comment Content is this: ${commentFromAi}`);
      await customComment(commentFromAi);
    } else {
      console.warn("No comment returned from API");
    }
  } catch (error) {
    console.log(error);
  }
}

// Close the current tab
async function closeTab() {
  console.log("Telling background to close tab");
  chrome.runtime.sendMessage({ action: "closeTab" });
}
