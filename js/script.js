// Parent Mode & Mission Approval
const ParentMode = {
  active: false,
  toggle() {
    this.active = !this.active;
    const missionBox = document.getElementById("missions-container");
    if (this.active) {
      missionBox.innerHTML = `
        <h2>Parent Mode</h2>
        <button onclick="ParentMode.approveMission(50)">Approve Mission (+50 XP)</button>
      `;
    } else {
      missionBox.innerHTML = "";
    }
  },

  approveMission(xp) {
    xpSystem.addXP(xp);
    crystal.glow();
    setTimeout(() => crystal.resetGlow(), 2000);
  }
};