let players = [];

document.getElementById("addForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const skill = parseInt(document.getElementById("skill").value) || 0;
  const kills = parseInt(document.getElementById("kills").value) || 0;
  const playtime = parseInt(document.getElementById("playtime").value) || 0;
  const tier = document.getElementById("tier").value;
  const region = document.getElementById("region").value;

  if (!name) return alert("Please enter a player name");

  const regionFlag = region === "NA" ? "🇺🇸" :
                     region === "EU" ? "🇪🇺" :
                     region === "AS" ? "🌏" :
                     region === "ME" ? "🌍" : "🌍";

  const avatar = `https://minotar.net/avatar/${encodeURIComponent(name)}/64`;

  const existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.skill = skill;
    existing.kills = kills;
    existing.playtime = playtime;
    existing.tier = tier;
    existing.region = region;
    existing.flag = regionFlag;
  } else {
    players.push({ name, avatar, skill, kills, playtime, tier, region, flag: regionFlag });
  }

  renderList();
  e.target.reset();
});

function renderList() {
  const list = document.getElementById("playerList");
  list.innerHTML = players.map(p => `
    <div class="player">
      <img src="${p.avatar}" class="avatar">
      <div class="info">
        <div class="name">${p.name} <span class="region">${p.flag} ${p.region}</span></div>
        <div class="stats">🏆 ${p.skill} | ⚔️ ${p.kills} | ⏱️ ${p.playtime}h | ${p.tier}</div>
      </div>
    </div>
  `).join("");
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(players, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stats.json";
  a.click();
  URL.revokeObjectURL(a.href);
});
