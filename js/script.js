document.addEventListener("DOMContentLoaded", () => {
    const parentModeBtn = document.getElementById("parentModeBtn");
    const parentMode = document.getElementById("parentMode");
    const enterPinBtn = document.getElementById("enterPinBtn");
    const parentControls = document.getElementById("parentControls");
    const approveMissionBtn = document.getElementById("approveMissionBtn");

    const correctPin = "1234";

    parentModeBtn.addEventListener("click", () => {
        parentMode.style.display = "block";
    });

    enterPinBtn.addEventListener("click", () => {
        const enteredPin = document.getElementById("parentPin").value;
        if (enteredPin === correctPin) {
            parentControls.style.display = "block";
        } else {
            alert("Incorrect PIN.");
        }
    });

    approveMissionBtn.addEventListener("click", () => {
        addXP(50);
    });

    updateStatus();
});