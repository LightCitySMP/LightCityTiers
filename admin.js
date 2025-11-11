let players=[];
const iconMap={
  Sword:"sword",
  SMP:"ender_pearl",
  UHC:"heart",
  NethOP:"netherite_sword",
  Pot:"potion",
  Mace:"mace",
  Axe:"axe",
  Crystal:"crystal"
};

document.getElementById("addForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const skill=parseInt(document.getElementById("skill").value);
  const kills=parseInt(document.getElementById("kills").value);
  const playtime=parseInt(document.getElementById("playtime").value);
  const mode=document.getElementById("mode").value;
  const tier=document.getElementById("tier").value;
  const icon=iconMap[mode];
  if(!name)return;
  let player=players.find(p=>p.name.toLowerCase()===name.toLowerCase());
  if(!player){
    player={name,avatar:`https://minotar.net/avatar/${name}/64`,skill,kills,playtime,modes:{}};
    players.push(player);
  }
  player.skill=skill;player.kills=kills;player.playtime=playtime;
  player.modes[mode]={tier,icon};
  render();
  e.target.reset();
});

function render(){
  const list=document.getElementById("playerList");
  list.innerHTML=players.map(p=>{
    const modes=Object.entries(p.modes).map(([m,v])=>
      `<span class="mode" style="--tier:${tierColor(v.tier)}">
         <img src="icons/${v.icon}.png" class="modeicon"> ${m} ${v.tier}
       </span>`).join(" ");
    return `<div class="player">
      <img src="${p.avatar}" class="avatar">
      <div class="info">
        <h2>${p.name}</h2>
        <p>${modes}</p>
        <p class="stats">🏆 ${p.skill} ⚔️ ${p.kills} ⌚ ${p.playtime} h</p>
      </div>
    </div>`;
  }).join("");
}
function tierColor(t){
  if(/5/.test(t))return"#b87333";
  if(/4/.test(t))return"#cfcfcf";
  if(/3/.test(t))return"#ffd700";
  if(/2/.test(t))return"#5ad3ff";
  return"#ff0055";
}

document.getElementById("exportBtn").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(players,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="stats.json";
  a.click();
  URL.revokeObjectURL(a.href);
});
