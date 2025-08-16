// Crystal Display & Interaction
const crystal = {
  element: null,
  init() {
    this.element = document.createElement("div");
    this.element.id = "crystal";
    this.element.textContent = "🔷";
    document.getElementById("crystal-container").appendChild(this.element);
  },

  glow() {
    if (this.element) {
      this.element.style.filter = "drop-shadow(0 0 10px cyan)";
    }
  },

  resetGlow() {
    if (this.element) {
      this.element.style.filter = "none";
    }
  }
};

window.addEventListener("load", () => {
  crystal.init();
});