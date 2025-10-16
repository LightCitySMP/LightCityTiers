let playersData = [];

// Load stats.json with error handling + cache bypass for GitHub Pages
async function loadStats() {
  try {
    const response = await fetch('./stats.json', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!response.ok) throw new Error("stats.json not found or inaccessible.");
    const data = await response.json();
    playersData = data;
    renderLeaderboard("skill");
  } catch (err) {
    console.error("Error loading stats.json:", err);
    document.getElementById("playersList").innerHTML =
      "<p style='text-align:center;color:#ffb300;'>⚠️ Could not load stats.json — make sure it's uploaded in the same folder.</p>";
  }
}
loadStats();

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

  let sorted = [...playersData].sort((a, b) => b[category] - a[category]);

  if (sorted.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#ffb300;">No player data yet.</p>`;
    return;
  }

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

// Category tabs
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

  const container = document.getElementById("playersList");

  if (results.length > 0) {
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
    container.innerHTML = `<p style="text-align:center;color:#ffb300;">No player found.</p>`;
  }
}

