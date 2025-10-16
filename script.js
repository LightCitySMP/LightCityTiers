let playersData = [];

// Load stats.json
fetch("stats.json")
  .then(response => response.json())
  .then(data => {
    playersData = data;
    renderLeaderboard("skill");
  });

// Render leaderboard
function renderLeaderboard(category) {
  const container = document.getElementById("playersList");
  const title = document.getElementById("categoryTitle");

  title.textContent =
    category === "skill"
      ? "🏆 Overall Skill"
      : category === "kills"
      ? "⚔️ Kills"
      : "⌚ Playtime";

  let sorted = [...playersData].sort(
    (a, b) => b[category] - a[category]
  );

  container.innerHTML = sorted
    .map((p, i) => {
      let rankClass =
        i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
      return `
      <div class="player">
        <div class="details">
          <div class="rank ${rankClass}">${i + 1}.</div>
          <img class="avatar" src="${p.avatar}" alt="${p.name}">
          <div class="name">${p.name}</div>
        </div>
        <div class="points">${
          category === "skill"
            ? "🏆 " + p.skill + " skill points"
            : category === "kills"
            ? "⚔️ " + p.kills + " kills"
            : "⌚ " + p.playtime + " hours"
        }</div>
      </div>`;
    })
    .join("");
}

// Category switching
document.querySelectorAll(".category").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderLeaderboard(tab.getAttribute("data-category"));
  });
});

// Search functionality
document.getElementById("searchBtn").addEventListener("click", searchPlayer);
document.getElementById("searchInput").addEventListener("keypress", e => {
  if (e.key === "Enter") searchPlayer();
});

function searchPlayer() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const results = playersData.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  if (results.length > 0) {
    const container = document.getElementById("playersList");
    container.innerHTML = results
      .map((p, i) => `
        <div class="player">
          <div class="details">
            <div class="rank">${i + 1}.</div>
            <img class="avatar" src="${p.avatar}" alt="${p.name}">
            <div class="name">${p.name}</div>
          </div>
          <div class="points">🏆 ${p.skill} skill points</div>
        </div>
      `)
      .join("");
  } else {
    alert("Player not found!");
  }
}

