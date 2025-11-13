async function loadBoard(type="skill") {
  const res = await fetch("stats.json");
  const data = await res.json();
  renderBoard(data, type);

  // tab switching
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.onclick = () => {
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      btn.classList.add("active");
      renderBoard(data, btn.dataset.type);
    };
  });

  // search
  const search = document.getElementById("search");
  search.addEventListener("input", ()=>{
    const filtered = data.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()));
    renderBoard(filtered, type);
  });
}

function renderBoard(data, type) {
  const lb = document.getElementById("leaderboard");
  lb.innerHTML = "";

  const sorted = [...data].sort((a,b)=>b[type]-a[type]);
  sorted.forEach((p, i)=>{
    const tierClass = i==0?"gold":i==1?"iron":i==2?"bronze":"";
    const regionFlag = p.flag || "🌍";
    const regionName = p.region || "Unknown";

    const div = document.createElement("div");
    div.className = "player";
    div.innerHTML = `
      <img src="${p.avatar}" class="avatar">
      <div class="info">
        <div class="name">${p.name} <span class="region">${regionFlag} ${regionName}</span></div>
        <div class="stats">${
          type==="skill"?`🏆 ${p.skill}`:type==="kills"?`⚔️ ${p.kills}`:`⏱️ ${p.playtime}h`
        }</div>
      </div>
      <div class="tier ${tierClass}">${p.tier || ""}</div>
    `;
    lb.appendChild(div);
  });
}

loadBoard();

