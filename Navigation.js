export function Navigation() {
  const nav = document.createElement('nav');
  nav.className = 'navigation';
  nav.innerHTML = `
    <button>Dashboard</button>
    <button>Missions</button>
    <button>Parent Mode</button>
  `;
  return nav;
}