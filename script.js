let allPlayers = [];

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".leaderboard").forEach(lb => lb.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

fetch("stats.json")
  .then(res => res.json())
  .then(data => {
    allPlayers = data;
    renderBoards(data);
  })
  .catch(err => console.error("Error loading stats:", err));

function renderBoards(players) {
  const cats = ["skill", "kills", "playtime"];
  const ids = ["overallList", "killsList", "playtimeList"];

  cats.forEach((c, i) => {
    const div = document.getElementById(ids[i]);
    const sorted = [...players].sort((a, b) => b[c] - a[c]);
    if (sorted.length === 0) {
      div.innerHTML = `<div class="no-results">No players found</div>`;
      return;
    }

    div.innerHTML = sorted.map((p, index) => `
      <div class="player">
        <div class="player-left">
          <div class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</div>
          <img src="${p.avatar}" alt="${p.name}">
          <div class="name">${p.name}</div>
        </div>
        <div class="score">
          ${c === "skill" ? `🏆 ${p.skill} skill points` :
            c === "kills" ? `⚔️ ${p.kills} kills` :
            `⌚ ${p.playtime} hours`}
        </div>
      </div>
    `).join("");
  });
}

// SEARCH PLAYER
document.getElementById("searchBtn").addEventListener("click", doSearch);
document.getElementById("searchInput").addEventListener("keypress", e => {
  if (e.key === "Enter") doSearch();
});

function doSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  if (!query) { renderBoards(allPlayers); return; }
  const filtered = allPlayers.filter(p => p.name.toLowerCase().includes(query));
  renderBoards(filtered);
}


