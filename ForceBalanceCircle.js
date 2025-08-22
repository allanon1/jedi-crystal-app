export function ForceBalanceCircle() {
  const container = document.createElement('div');
  container.className = 'force-circle';
  container.innerHTML = `
    <div class="crystal"></div>
    <p>Force Balance Circle</p>
  `;
  return container;
}