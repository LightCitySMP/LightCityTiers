// ---------- CONFIG ----------
const DEFAULT_HASH = "c807ed4f8f4754eb96627744d3b840e2bd671adddb89381ed5f2be386f2a3aae";
const HASH_KEY = "lct_admin_hash";
const AUTH_KEY = "lct_admin_auth";

// ---------- helpers ----------
async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function showOverlay(show = true) {
  document.getElementById("pwOverlay").style.display = show ? "flex" : "none";
}
function showPanel(show = true) {
  document.getElementById("adminPanel").style.display = show ? "block" : "none";
  document.getElementById("logoutBtn").style.display = show ? "inline-block" : "none";
  document.getElementById("sessionLabel").textContent = show ? "Authenticated" : "Not authenticated";
}
function getStoredHash() {
  return localStorage.getItem(HASH_KEY) || DEFAULT_HASH;
}

// ---------- auth flow ----------
async function tryResumeSession() {
  const authed = sessionStorage.getItem(AUTH_KEY);
  if (authed === "1") {
    showOverlay(false);
    showPanel(true);
    initPanel();
    return;
  }
  showOverlay(true);
  showPanel(false);
}

document.getElementById("pwSubmit").addEventListener("click", async () => {
  const val = document.getElementById("pwInput").value || "";
  const h = await sha256Hex(val.trim());
  if (h === getStoredHash()) {
    sessionStorage.setItem(AUTH_KEY, "1");
    showOverlay(false);
    showPanel(true);
    initPanel();
  } else {
    const e = document.getElementById("pwErr");
    e.textContent = "Incorrect password.";
    e.style.display = "block";
  }
});

document.getElementById("pwCancel").addEventListener("click", () => {
  showOverlay(false);
  alert("Access to admin panel cancelled.");
  window.location.href = "./";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_KEY);
  showPanel(false);
  showOverlay(true);
});

document.getElementById("changePw").addEventListener("click", async (e) => {
  e.preventDefault();
  const curr = document.getElementById("changeCurr").value || "";
  const neu = document.getElementById("changeNew").value || "";
  if (!curr || !neu) return alert("Fill both current and new password fields.");
  const currH = await sha256Hex(curr.trim());
  if (currH !== getStoredHash()) return alert("Current password incorrect.");
  const newH = await sha256Hex(neu.trim());
  localStorage.setItem(HASH_KEY, newH);
  document.getElementById("changeCurr").value = "";
  document.getElementById("changeNew").value = "";
  alert("Password changed for this browser.");
});

// ---------- admin panel ----------
let players = [];

// Gamemode → icon map
const iconMap = {
  Sword: "sword",
  SMP: "ender_pearl",
  UHC: "heart",
  NethOP: "netherite_sword",
  Pot: "potion",
  Mace: "mace",
  Axe: "axe",
  Crystal: "crystal"
};

function initPanel() {
  renderPlayers();

  // Add player
  const form = document.getElementById("addForm");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const username = document.getElementById("username").value.trim();
    const category = document.getElementById("category").value;
    const value = parseInt(document.getElementById("value").value, 10);
    const gamemode = document.getElementById("gamemode").value;
    const tier = document.getElementById("tier").value;
    if (!username || isNaN(value)) return alert("Fill valid username and number.");

    const avatar = `https://minotar.net/avatar/${encodeURIComponent(username)}/64`;
    const icon = iconMap[gamemode] || "sword";

    let existing = players.find(p => p.name.toLowerCase() === username.toLowerCase());
    if (existing) {
      existing[category] = value;
      existing.mode = gamemode;
      existing.tier = tier;
      existing.icon = icon;
    } else {
      players.push({
        name: username,
        avatar,
        skill: category === "skill" ? value : 0,
        kills: category === "kills" ? value : 0,
        playtime: category === "playtime" ? value : 0,
        mode: gamemode,
        tier,
        icon
      });
    }

    renderPlayers();
    form.reset();
  });

  // Save/export JSON
  document.getElementById("saveBtn").addEventListener("click", () => {
    if (players.length === 0) return alert("No players to save.");
    const blob = new Blob([JSON.stringify(players, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear
  document.getElementById("clearBtn").addEventListener("click", () => {
    if (!confirm("Clear all players from the panel?")) return;
    players = [];
    renderPlayers();
  });

  // Preview
  document.getElementById("exportPreview").addEventListener("click", () => {
    const txt = JSON.stringify(players, null, 2);
    const w = window.open("", "_blank");
    w.document.body.style.background = "#111";
    w.document.body.style.color = "#ddd";
    w.document.title = "stats.json preview";
    w.document.body.innerText = txt;
  });
}

// ---------- render ----------
function renderPlayers() {
  const container = document.getElementById("playersContainer");
  if (!players || players.length === 0) {
    container.innerHTML = `<div style="color:var(--muted); padding:8px">No players added yet.</div>`;
    return;
  }
  container.innerHTML = players.map((p, idx) => {
    const color = tierColor(p.tier);
    return `
      <div class="player-item" data-index="${idx}">
        <img src="${p.avatar}" alt="${p.name}">
        <div class="player-info">
          <span>${p.name}</span>
          <small>
            <img src="icons/${p.icon}.png" class="mode-icon" alt="">
            ${p.mode || ''} —
            <span class="tier-badge tier-${p.tier}" style="--tier:${color}">${p.tier}</span><br>
            🏆 ${p.skill} | ⚔️ ${p.kills} | ⌚ ${p.playtime}
          </small>
        </div>
        <div style="margin-left:auto; display:flex; gap:8px; align-items:center">
          <button class="ghost" data-action="edit" style="padding:6px 8px">Edit</button>
          <button class="ghost" data-action="del" style="padding:6px 8px">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  // listeners
  container.querySelectorAll(".player-item").forEach(item => {
    const idx = parseInt(item.getAttribute("data-index"), 10);
    item.querySelector('[data-action="del"]').addEventListener("click", () => {
      if (!confirm(`Delete ${players[idx].name}?`)) return;
      players.splice(idx, 1);
      renderPlayers();
    });
    item.querySelector('[data-action="edit"]').addEventListener("click", () => {
      const p = players[idx];
      const newVal = prompt(`Edit ${p.name} (format: skill,kills,playtime)`, `${p.skill},${p.kills},${p.playtime}`);
      if (!newVal) return;
      const parts = newVal.split(",").map(s => parseInt(s.trim(), 10) || 0);
      p.skill = parts[0] || 0;
      p.kills = parts[1] || 0;
      p.playtime = parts[2] || 0;
      renderPlayers();
    });
  });
}

// ---------- helpers ----------
function tierColor(t) {
  if (/5/.test(t)) return "#b87333"; // bronze
  if (/4/.test(t)) return "#cfcfcf"; // iron
  if (/3/.test(t)) return "#ffd700"; // gold
  if (/2/.test(t)) return "#5ad3ff"; // diamond
  return "#ff0055"; // ruby
}

// ---------- init ----------
tryResumeSession();

// drag/drop to load stats.json
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => {
  e.preventDefault();
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!f) return;
  if (!confirm(`Load ${f.name} into admin panel (this will replace current list)?`)) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error("Invalid JSON");
      players = data.map(p => ({
        name: p.name || "Unknown",
        avatar: p.avatar || `https://minotar.net/avatar/${encodeURIComponent(p.name || "Unknown")}/64`,
        skill: p.skill || 0,
        kills: p.kills || 0,
        playtime: p.playtime || 0,
        mode: p.mode || "Sword",
        tier: p.tier || "LT5",
        icon: p.icon || "sword"
      }));
      renderPlayers();
      alert("Loaded players from file.");
    } catch (err) {
      alert("Failed to load JSON: " + err.message);
    }
  };
  reader.readAsText(f);
});
