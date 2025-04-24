// Get DOM elements
const automationBtn = document.querySelector("#btn");
const featureItems = document.querySelectorAll(".feature-item");

// Add animation to feature items
featureItems.forEach((item, index) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(10px)";

  setTimeout(() => {
    item.style.transition = "all 0.3s ease";
    item.style.opacity = "1";
    item.style.transform = "translateY(0)";
  }, 100 + index * 150); // Staggered animation
});

// Button click event
automationBtn.addEventListener("click", () => {
  console.log("Automation button clicked");

  // Visual feedback for button click
  automationBtn.classList.add("active");
  automationBtn.innerHTML =
    '<span class="material-symbols-rounded">autorenew</span> Processing...';

  // Send message to background script to start automation
  chrome.runtime.sendMessage({ action: "startAutomation" }, (response) => {
    console.log("Response from background:", response);

    // Update button to show success state
    setTimeout(() => {
      automationBtn.innerHTML =
        '<span class="material-symbols-rounded">check_circle</span> Success!';
      automationBtn.style.background =
        "linear-gradient(45deg, #34D399, #10B981)";
      automationBtn.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.3)";
    }, 1000);
  });
});
