export function initScrollToTop() {
  const btn = document.getElementById('scrollToTopBtn');

  if (!btn) return;

  // Показ при прокрутке
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });

  // Плавная прокрутка
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
