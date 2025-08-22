let xp = 0;

export function XPSystem() {
  const container = document.createElement('div');
  container.className = 'xp-system';

  const xpDisplay = document.createElement('p');
  xpDisplay.textContent = `XP: ${xp}`;
  container.appendChild(xpDisplay);

  const gainBtn = document.createElement('button');
  gainBtn.textContent = 'Gain XP';
  gainBtn.onclick = () => {
    xp += 10;
    xpDisplay.textContent = `XP: ${xp}`;
    localStorage.setItem('xp', xp);
  };
  container.appendChild(gainBtn);

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => {
    xp = 0;
    xpDisplay.textContent = `XP: ${xp}`;
    localStorage.setItem('xp', xp);
  };
  container.appendChild(resetBtn);

  return container;
}