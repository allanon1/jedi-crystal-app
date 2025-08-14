// script.js
// UI logic: missions, rewards, alignment/XP, daily reset, parent console, customization.
// Talks to CrystalRenderer (3D or 2D fallback).

const PIN = '1234';

// --------- State & Storage
const load = (k, def) => {
  try{ const v = JSON.parse(localStorage.getItem(k)); return (v===null||v===undefined)?def:v; }catch(e){ return def; }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let state = load('state', {
  xp: 0,
  rank: 'Youngling',
  alignment: 10, // start light
  saberColor: '#00E5FF',
  robe: 'Padawan',
  crystalStyle: 'octa'
});

let missionsStore = load('missionsStore', { date: new Date().toDateString(), items: [] });
let rewardsStore = load('rewardsStore', [
  { name: "30 min Video Games", cost: 50 },
  { name: "Lightsaber Duel with Dad", cost: 75 }
]);

// --------- Ranks
const ranks = [
  { name:'Youngling', xp:0 },
  { name:'Padawan', xp:100 },
  { name:'Knight', xp:250 },
  { name:'Master', xp:500 }
];
function updateRank(){
  let r = ranks[0].name;
  for(const tier of ranks){ if(state.xp>=tier.xp) r=tier.name; }
  state.rank = r;
}

// --------- Missions (daily)
const defaultMissions = ()=>([
  { name:"Morning meditation", effect:-4, xp:5 },
  { name:"Lightsaber training 10 min", effect:-3, xp:5 },
  { name:"Help a family member", effect:-3, xp:5 },
  { name:"Argue with sibling", effect:6, xp:0 },
  { name:"Ignore a responsibility", effect:6, xp:0 }
]);

function ensureTodayMissions(){
  const today = new Date().toDateString();
  if(missionsStore.date !== today || missionsStore.items.length===0){
    missionsStore = { date: today, items: defaultMissions() };
    save('missionsStore', missionsStore);
  }
}
ensureTodayMissions();

// --------- Crystal hookup
function applyAlignment(){
  const label = document.getElementById('alignmentLabel');
  label.textContent = state.alignment < 50 ? "Light Side" : "Dark Side";
  CrystalRenderer.updateAlignment(state.alignment);
}
applyAlignment();

// --------- Renderers
function renderHome(){
  document.getElementById('xpValue').textContent = state.xp;
  document.getElementById('rankName').textContent = state.rank;
  applyAlignment();
}
function renderMissions(){
  const ul = document.getElementById('mission-list');
  ul.innerHTML = '';
  missionsStore.items.forEach((m, idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="meta">
        <input type="checkbox" id="m_${idx}">
        <label for="m_${idx}">${m.name}</label>
        <span class="badge ${m.effect<0?'light':'dark'}">${m.effect<0?'+Light':'-Light'}</span>
        <span class="badge">${m.xp} XP</span>
      </div>
      <button class="secondary" data-act="complete" data-idx="${idx}">Complete</button>
    `;
    ul.appendChild(li);
  });
}
function renderRewards(){
  const ul = document.getElementById('reward-list');
  ul.innerHTML = '';
  rewardsStore.forEach((r, idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="meta">
        <strong>${r.name}</strong>
        <span class="badge">${r.cost} XP</span>
      </div>
      <button class="secondary" data-act="redeem" data-idx="${idx}">Redeem</button>
    `;
    ul.appendChild(li);
  });
}

renderHome(); renderMissions(); renderRewards();

// --------- Interactions
document.querySelectorAll('.top-nav .link').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = btn.dataset.screen;
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+target).classList.add('active');
  });
});

document.getElementById('mission-list').addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-act="complete"]');
  if(!btn) return;
  const idx = parseInt(btn.dataset.idx,10);
  const m = missionsStore.items[idx];
  if(!m) return;

  // Apply effects
  const oldAlign = state.alignment;
  state.alignment = Math.max(0, Math.min(100, state.alignment + m.effect));
  state.xp += m.xp;
  updateRank();

  // Crystal reaction
  if(oldAlign < 70 && state.alignment >= 70) CrystalRenderer.pulseDamage();
  if(oldAlign >= 70 && state.alignment < 70) CrystalRenderer.pulseHeal();
  applyAlignment();
  save('state', state);

  // Remove mission from list
  missionsStore.items.splice(idx,1);
  save('missionsStore', missionsStore);
  renderMissions();
  renderHome();
});

document.getElementById('refreshMissions').addEventListener('click', ()=>{
  missionsStore = { date: new Date().toDateString(), items: defaultMissions() };
  save('missionsStore', missionsStore);
  renderMissions();
});

// Rewards redeem
document.getElementById('screen-rewards').addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-act="redeem"]');
  if(!btn) return;
  const idx = parseInt(btn.dataset.idx,10);
  const r = rewardsStore[idx];
  if(!r) return;
  if(state.xp < r.cost){ alert('Not enough XP yet.'); return; }
  if(!confirm(`Redeem "${r.name}" for ${r.cost} XP?`)) return;
  state.xp -= r.cost;
  save('state', state);
  renderHome();
  alert('Reward redeemed! (Parent approval flow will be added later.)');
});

// Customize
document.getElementById('screen-customize').addEventListener('click',(e)=>{
  const colorBtn = e.target.closest('.chip.color');
  const robeBtn = e.target.closest('.chip[data-robe]');
  const crystalBtn = e.target.closest('.chip[data-crystal]');
  if(colorBtn){ state.saberColor = colorBtn.dataset.saber; save('state',state); }
  if(robeBtn){ state.robe = robeBtn.dataset.robe; save('state',state); }
  if(crystalBtn){ state.crystalStyle = crystalBtn.dataset.crystal; save('state',state); }
});

// Parent
const parentGate = document.getElementById('parent-gate');
const parentPanel = document.getElementById('parent-panel');
document.getElementById('pinBtn').addEventListener('click',()=>{
  const v = document.getElementById('pinInput').value;
  if(v===PIN){
    parentGate.classList.add('hidden');
    parentPanel.classList.remove('hidden');
  } else {
    alert('Incorrect PIN');
  }
});

// Add mission
document.getElementById('addMission').addEventListener('click',()=>{
  const name = document.getElementById('mName').value.trim();
  const effect = parseInt(document.getElementById('mEffect').value||'0',10);
  const xp = parseInt(document.getElementById('mXP').value||'0',10);
  if(!name) return alert('Enter a mission name');
  missionsStore.items.push({ name, effect, xp });
  save('missionsStore', missionsStore);
  renderMissions();
  document.getElementById('mName').value='';
  document.getElementById('mEffect').value='';
  document.getElementById('mXP').value='';
});

// Add reward
document.getElementById('addReward').addEventListener('click',()=>{
  const name = document.getElementById('rName').value.trim();
  const cost = parseInt(document.getElementById('rCost').value||'0',10);
  if(!name) return alert('Enter a reward name');
  rewardsStore.push({ name, cost });
  save('rewardsStore', rewardsStore);
  renderRewards();
  document.getElementById('rName').value='';
  document.getElementById('rCost').value='';
});

// Export / Import / Reset
document.getElementById('exportBtn').addEventListener('click',()=>{
  const payload = {
    state, missionsStore, rewardsStore, version: 1
  };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'jedi-tracker-backup.json';
  a.click();
});

document.getElementById('importBtn').addEventListener('click',()=>{
  const f = document.getElementById('importFile').files[0];
  if(!f) return alert('Choose a JSON file first.');
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(!data || !data.state) throw new Error('Invalid file');
      state = data.state; missionsStore = data.missionsStore; rewardsStore = data.rewardsStore;
      save('state',state); save('missionsStore',missionsStore); save('rewardsStore',rewardsStore);
      ensureTodayMissions();
      renderHome(); renderMissions(); renderRewards();
      applyAlignment();
      alert('Import complete.');
    }catch(err){ alert('Import failed: '+err.message); }
  };
  reader.readAsText(f);
});

document.getElementById('resetAll').addEventListener('click',()=>{
  if(!confirm('Factory reset? This clears all local progress.')) return;
  localStorage.clear();
  location.reload();
});

// Initial rank calc & render
updateRank();
renderHome();
