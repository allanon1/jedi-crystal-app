import { saveProgress, loadProgress } from './storage.js';

// Load saved progress
let state = loadProgress();

function updateUI() {
  document.getElementById("xp").innerText = state.xp;
  document.getElementById("rank").innerText = state.rank;
}

// Add XP
document.getElementById("add-xp").addEventListener("click", () => {
  state.xp += 10;
  if (state.xp >= 100) {
    state.rank++;
    state.xp = 0;
  }
  saveProgress(state);
  updateUI();
});

// Reset Progress
document.getElementById("reset").addEventListener("click", () => {
  state = { xp: 0, rank: 1 };
  saveProgress(state);
  updateUI();
});

updateUI();
