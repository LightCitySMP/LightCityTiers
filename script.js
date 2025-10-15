// Handles tab switching & smooth fade animation
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    const targetId = tab.dataset.tab;
    const target = document.getElementById(targetId);
    target.classList.add("active");

    // Simple fade animation
    target.style.opacity = 0;
    setTimeout(() => {
      target.style.transition = "opacity 0.4s ease";
      target.style.opacity = 1;
    }, 50);
  });
});

