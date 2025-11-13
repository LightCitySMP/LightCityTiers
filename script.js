async function loadLeaderboard(type = "skill") {
  const res = await fetch("stats.json");
  const players = await res.json();

  players.sort((a, b) => (b[type] || 0) - (a[type] || 0));

  const lb = document.getElementById("leaderboard");
  lb.innerHTML = "";

  players.forEach((p, i) => {
    const rank = i + 1;
    const rankClass =
      rank === 1 ? "gold" :
      rank === 2 ? "silver" :
      rank === 3 ? "bronze" : "";

    const value =
      type === "skill" ? `${p.skill} pts` :
      type === "kills" ? `${p.kills} kills` :
      `${p.playtime} h`;

    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <div class="rank ${rankClass}">#${rank}</div>
      <img src="${p.avatar}" class="avatar">
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="stats">
          ${type === "skill" ? "🏆" : type === "kills" ? "⚔️" : "⏱️"} ${value}
        </div>
      </div>
    `;
    lb.appendChild(card);
  });
}

// Tabs switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loadLeaderboard(tab.dataset.type);
  });
});

// Search filter
document.getElementById("searchBar").addEventListener("input", e => {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll(".player-card").forEach(card => {
    const name = card.querySelector(".name").textContent.toLowerCase();
    card.style.display = name.includes(search) ? "flex" : "none";
  });
});

loadLeaderboard("skill");
