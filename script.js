document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".category");
  const sections = document.querySelectorAll(".leaderboard");
  const searchInput = document.getElementById("searchInput");

  // Switch between categories
  categories.forEach(cat => {
    cat.addEventListener("click", () => {
      categories.forEach(c => c.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));
      cat.classList.add("active");
      document.getElementById(cat.dataset.tab).classList.add("active");
    });
  });

  // Load stats.json
  fetch("stats.json")
    .then(res => res.json())
    .then(players => {
      renderLeaderboard(players, "overallList", "skill", "🏆");
      renderLeaderboard(players, "killsList", "kills", "⚔️");
      renderLeaderboard(players, "playtimeList", "playtime", "🕰️");
    })
    .catch(err => console.error("Error loading stats:", err));

  function renderLeaderboard(players, listId, statKey, icon) {
    const list = document.getElementById(listId);
    list.innerHTML = "";
    players
      .sort((a, b) => b[statKey] - a[statKey])
      .forEach((p, i) => {
        const card = document.createElement("div");
        card.className = "player-card";
        card.innerHTML = `
          <div class="rank">${i + 1}.</div>
          <img src="${p.avatar}" alt="${p.name}">
          <div class="info">
            <h3>${p.name}</h3>
            <p>${icon} ${p[statKey]} ${statKey}</p>
          </div>
        `;
        list.appendChild(card);
      });
  }

  // Search player
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".player-card").forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(value) ? "flex" : "none";
    });
  });
});


