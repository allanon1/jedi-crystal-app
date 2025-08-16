// XP & Rank System
const xpSystem = {
  xp: 0,
  rank: "Youngling",
  ranks: [
    { name: "Youngling", xpNeeded: 0 },
    { name: "Initiate", xpNeeded: 100 },
    { name: "Padawan", xpNeeded: 300 },
    { name: "Knight", xpNeeded: 600 },
    { name: "Master", xpNeeded: 1000 },
    { name: "Grand Master", xpNeeded: 1500 }
  ],

  addXP(amount) {
    this.xp += amount;
    this.updateRank();
    this.updateUI();
  },

  updateRank() {
    for (let i = this.ranks.length - 1; i >= 0; i--) {
      if (this.xp >= this.ranks[i].xpNeeded) {
        this.rank = this.ranks[i].name;
        break;
      }
    }
  },

  updateUI() {
    const rankDisplay = document.getElementById("rank-display");
    if (rankDisplay) {
      rankDisplay.textContent = `Rank: ${this.rank} | XP: ${this.xp}`;
    }
  }
};

window.addEventListener("load", () => {
  xpSystem.updateUI();
});