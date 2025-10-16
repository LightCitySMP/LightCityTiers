let playersData = [];

fetch("stats.json")
  .then(response => response.json())
  .then(data => {
    playersData = data;
    renderLeaderboard("skill");
  });

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
        <div class
