import { ForceBalanceCircle } from './ForceBalanceCircle.js';
import { Navigation } from './Navigation.js';
import { XPSystem } from './XPSystem.js';

export function App() {
  const container = document.createElement('div');
  container.className = 'app-container';

  const header = document.createElement('h1');
  header.textContent = 'Jedi Training Tracker';
  container.appendChild(header);

  container.appendChild(Navigation());
  container.appendChild(ForceBalanceCircle());
  container.appendChild(XPSystem());

  return container;
}