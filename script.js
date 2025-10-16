document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".leaderboard").forEach(l => l.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

fetch("stats.json")
  .then(res => res.json())
  .then(players => {
    const categories = ["skill", "kills", "playtime"];
    const map = { skill: "overallList", kills: "killsList", playtime: "playtimeList" };

    categories.forEach(cat => {
      const sorted = [...players].sort((a, b) => b[cat] - a[cat]);
      const container = document.getElementById(map[cat]);
      container.innerHTML = sorted.map((p, i) => `
        <div class="player">
          <div class="player-left">
            <div class="rank">${i + 1}.</div>
            <img src="${p.avatar}" alt="${p.name}">
            <div class="name">${p.name}</div>
          </div>
          <div class="score">
            ${cat === "skill" ? `🏆 ${p.skill} skill points` :
              cat === "kills" ? `⚔️ ${p.kills} kills` :
              `⌚ ${p.playtime} hours`}
          </div>
        </div>
      `).join("");
    });
  })
  .catch(() => console.error("Failed to load stats.json"));

