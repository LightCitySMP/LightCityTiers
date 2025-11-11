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
    card.innerHTML = `
      <div class="rank ${rankClass}">#${rank}</div>
      <img src="${p.avatar}" class="avatar">
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="region">${p.region || "Unknown"}</div>
      </div>
      <div class="tiers">${formatTiers(p.tiers)}</div>
    `;
    lb.appendChild(card);
  });
}

function formatTiers(tiers) {
  if (!tiers) return "";
  return Object.entries(tiers)
    .map(([mode, tier]) => `<span title="${mode}">${tier}</span>`)
    .join("");
}

// Search functionality
document.getElementById("searchBar").addEventListener("input", e => {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll(".player-card").forEach(card => {
    const name = card.querySelector(".name").textContent.toLowerCase();
    card.style.display = name.includes(search) ? "flex" : "none";
  });
});

// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loadLeaderboard(tab.dataset.type);
  });
});

// Initial load
loadLeaderboard("skill");
