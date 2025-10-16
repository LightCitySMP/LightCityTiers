document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  // Load stats.json
  fetch("stats.json")
    .then(res => res.json())
    .then(players => {
      const sortBy = (key) =>
        [...players].sort((a, b) => b[key] - a[key]);

      const createRow = (p, i, category) => `
        <div class="player-row ${i === 0 ? 'first' : i === 1 ? 'second' : i === 2 ? 'third' : ''}">
          <div class="rank-box"><span class="rank-number">${i + 1}.</span></div>
          <img class="avatar" src="${p.avatar}" alt="${p.name}">
          <div class="player-info">
            <p class="player-name">${p.name}</p>
            <p class="player-title">${
              category === "skill"
                ? `🏆 ${p.skill} skill points`
                : category === "kills"
                ? `⚔️ ${p.kills} kills`
                : `⌚ ${p.playtime} playtime hours`
            }</p>
          </div>
        </div>
      `;

      const renderBoard = (tabId, key) => {
        const container = document.getElementById(tabId);
        container.innerHTML = sortBy(key)
          .map((p, i) => createRow(p, i, key))
          .join("");
      };

      renderBoard("overall", "skill");
      renderBoard("kills", "kills");
      renderBoard("playtime", "playtime");
    })
    .catch(err => console.error("Error loading stats:", err));

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
});

