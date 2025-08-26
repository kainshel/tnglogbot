export function openModal(modal) {
  modal.setAttribute('aria-hidden','false');
  modal.style.pointerEvents = 'auto';
  // trap focus (simple)
  const first = modal.querySelector('input,button,a,select,textarea');
  if (first) first.focus();
}

export function closeModal(modal) {
  modal.setAttribute('aria-hidden','true');
  modal.style.pointerEvents = 'none';
}
