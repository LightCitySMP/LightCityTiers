// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".leaderboard").forEach(lb => lb.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Load stats.json
let allPlayers = [];

fetch("stats.json")
  .then(res => res.json())
  .then(data => {
    allPlayers = data;
    updateLeaderboards(data);
  })
  .catch(err => console.error("Error loading stats.json:", err));

// Update leaderboards
function updateLeaderboards(players) {
  const categories = ["skill", "kills", "playtime"];
  const ids = ["overallList", "killsList", "playtimeList"];

  categories.forEach((cat, i) => {
    const list = document.getElementById(ids[i]);
    const sorted = [...players].sort((a, b) => b[cat] - a[cat]);

    if (sorted.length === 0) {
      list.innerHTML = `<div class="no-results">No players found</div>`;
      return;
    }

    list.innerHTML = sorted.map((p, index) => `
      <div class="player">
        <div class="player-left">
          <div class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
            ${index + 1}.
          </div>
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
}

// Search player
document.getElementById("searchBtn").addEventListener("click", searchPlayer);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchPlayer();
});

function searchPlayer() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  if (!query) {
    updateLeaderboards(allPlayers);
    return;
  }

  const filtered = allPlayers.filter(p => p.name.toLowerCase().includes(query));
  updateLeaderboards(filtered);
}


