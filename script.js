// ====== LightCitySMP Leaderboard Script ======
// Handles tab switching animations and section visibility

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {

    // Remove active class from all tabs and contents
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    // Add active class to selected tab
    tab.classList.add("active");

    // Show corresponding leaderboard section
    const targetId = tab.dataset.tab;
    const targetContent = document.getElementById(targetId);
    targetContent.classList.add("active");

    // Smooth fade animation
    targetContent.style.opacity = 0;
    setTimeout(() => {
      targetContent.style.transition = "opacity 0.4s ease";
      targetContent.style.opacity = 1;
    }, 50);
  });
});
