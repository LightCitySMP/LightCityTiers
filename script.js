document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".category");
  const sections = document.querySelectorAll(".leaderboard");
  const searchInput = document.getElementById("searchInput");

  // Category Switching
  categories.forEach(cat => {
    cat.addEventListener("click", () => {
      categories.forEach(c => c.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));
      cat.classList.add("active");
      document.getElementById(cat.dataset.tab).classList.add("active");
    });
  });

  // Fetch and render stats.json
  fetch("stats.json")
    .then(res => res.json())
    .then(players => {
      const overallList = document.getElementById("overallList");
      const killsList = document.getElementById("killsList");
      const playtimeList = document.getElementById("playtimeList");

      players.sort((a, b) => b.skill - a.skill);
      players.forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "player-card";
        card.innerHTML = `
          <div class="rank">${i + 1}.</div>
          <img src="${p.avatar}" alt="${p.name}">
          <div class="info">
            <h3>${p.name}</h3>
            <p>🏆 ${p.skill} skill points</p>
          </div>
        `;
        overallList.appendChild(card);
      });
    });

  // Search Functionality
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".player-card").forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(value) ? "flex" : "none";
    });
  });
});

