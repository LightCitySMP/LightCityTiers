// ====== TAB SWITCHING ======
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    const targetId = tab.dataset.tab;
    const target = document.getElementById(targetId);
    target.classList.add("active");
  });
});

// ====== LOAD SAMPLE DATA (can be replaced with PlaceholderAPI or JSON later) ======
const sampleStats = [
  { name: "Issam", kills: 200, playtime: 182, skill: 420 },
  { name: "Player2", kills: 120, playtime: 110, skill: 300 },
  { name: "Player3", kills: 90, playtime: 95, skill: 260 }
];

function renderLeaderboard(type, key) {
  const container = document.getElementById(type + "List");
  const sorted = [...sampleStats].sort((a, b) => b[key] - a[key]);
  container.innerHTML = sorted.map((p, i) => `
    <div class="player-row ${i === 0 ? "first" : i === 1 ? "second" : i === 2 ? "third" : ""}">
      <div class="rank-box"><span class="rank-number">${i + 1}.</span></div>
      <img class="avatar" src="https://minotar.net/avatar/${p.name}/64" />
      <div class="player-info">
        <h3 class="player-name">${p.name}</h3>
        <p class="player-title">${
          type === "kills"
            ? `⚔️ ${p.kills} kills`
            : type === "playtime"
            ? `⌚ ${p.playtime}h playtime`
            : `🏆 ${p.skill} skill points`
        }</p>
      </div>
    </div>
  `).join("");
}

renderLeaderboard("overall", "skill");
renderLeaderboard("kills", "kills");
renderLeaderboard("playtime", "playtime");
