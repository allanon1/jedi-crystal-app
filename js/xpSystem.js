let xp = 0;
let rank = "Youngling";

const ranks = [
    { name: "Youngling", xp: 0 },
    { name: "Padawan", xp: 100 },
    { name: "Knight", xp: 300 },
    { name: "Master", xp: 600 },
    { name: "Grand Master", xp: 1000 }
];

function updateStatus() {
    document.getElementById("status").textContent = `Rank: ${rank} | XP: ${xp}`;
}

function addXP(amount) {
    xp += amount;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (xp >= ranks[i].xp) {
            rank = ranks[i].name;
            break;
        }
    }
    updateStatus();
}