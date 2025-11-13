// Load leaderboard
async function loadLeaderboard(type = "skill") {
  const res = await fetch("stats.json");
  const players = await res.json();

  // Sort by selected type
  players.sort((a, b) => (b[type] || 0) - (a[type] || 0));

  const lb = document.getElementById("leaderboard");
  lb.innerHTML = "";

  players.forEach((p, index) => {
    const rank = index + 1;
    let rankClass = "";
    if (rank === 1) rankClass = "gold";
    else if (rank === 2) rankClass = "silver";
    else if (rank === 3) rankClass = "bronze";

    const card = document.createElement("div");
    card.className = "player-card";

    // Fallbacks
    const skill = p.skill ?? 0;
    const kills = p.kills ?? 0;
    const playtime = p.playtime ?? 0;
    const region = p.region ?? "Unknown";

    card.innerHTML = `
      <div class="rank ${rankClass}">#${rank}</div>
      <img src="${p.avatar}" class="avatar">
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="stats">
          🏆 ${skill} ⚔️ ${kills} ⏱️ ${playtime}h 🌍 ${region}
        </div>
        <div class="tiers">${formatTiers(p.tiers)}</div>
      </div>
    `;

    lb.appendChild(card);
  });
}

function formatTiers(tiers) {
  if (!tiers) return "";
  return Object.entries(tiers)
    .map(([mode, tier]) => {
      let color = "#555";
      if (/5/.test(tier)) color = "#b87333"; // Bronze
      else if (/4/.test(tier)) color = "#c0c0c0"; // Iron
      else if (/3/.test(tier)) color = "#ffd700"; // Gold
      else if (/2/.test(tier)) color = "#5ad3ff"; // Diamond
      else if (/1/.test(tier)) color = "#ff0055"; // Ruby
      return `
        <span class="tier-badge" style="background:${color}" title="${mode}">
          ${tier}
        </span>`;
    })
    .join("");
}

// search
document.getElementById("searchBar").addEventListener("input", e => {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll(".player-card").forEach(card => {
    const name = card.querySelector(".name").textContent.toLowerCase();
    card.style.display = name.includes(search) ? "flex" : "none";
  });
});

// tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loadLeaderboard(tab.dataset.type);
  });
});

loadLeaderboard("skill");
