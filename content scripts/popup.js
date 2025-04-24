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
  // Visual feedback for button click
  automationBtn.classList.add("active");
  automationBtn.innerHTML =
    '<span class="material-symbols-rounded">autorenew</span> Processing...';

  // Reset button after a delay (for demo purposes)
  setTimeout(() => {
    automationBtn.innerHTML =
      '<span class="material-symbols-rounded">check_circle</span> Success!';
    automationBtn.style.background = "linear-gradient(45deg, #34D399, #10B981)";
    automationBtn.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.3)";
  }, 1000);
});

btn.addEventListener("click", () => {
  console.log("You clicked me");
  chrome.runtime.sendMessage({ action: "startAutomation" });
});
