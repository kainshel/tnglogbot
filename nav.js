export function renderNav(active) {
  const nav = document.querySelector('nav#topnav');
  if (!nav) return;
  nav.innerHTML = `
    <a href="./index.html" ${active==='home'?'aria-current="page"':''}>Главная</a>
    <a href="./exercises.html" ${active==='exercises'?'aria-current="page"':''}>Упражнения</a>
    <a href="./workout.html" ${active==='workout'?'aria-current="page"':''}>Тренировка</a>
    <a href="./profile.html" ${active==='profile'?'aria-current="page"':''}>Профиль</a>
  `;
}
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(console.error);
    });
  }
}