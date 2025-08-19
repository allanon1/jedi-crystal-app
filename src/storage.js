export function saveProgress(state) {
  localStorage.setItem("jedi-progress", JSON.stringify(state));
}

export function loadProgress() {
  const saved = localStorage.getItem("jedi-progress");
  return saved ? JSON.parse(saved) : { xp: 0, rank: 1 };
}
