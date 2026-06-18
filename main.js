/**
 * Hide-on-scroll navbar
 * - Oculta la navbar con transform: translateY(-100%) al scrollear hacia abajo
 * - La muestra nuevamente al scrollear hacia arriba
 * - Solo se activa después de los 80px desde el top
 */
(function () {
  const nav = document.querySelector('.nav-wrapper');
  if (!nav) return;

  const THRESHOLD = 80; // px desde el top antes de activar
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= THRESHOLD) {
      // Siempre visible cerca del top
      nav.classList.remove('nav-wrapper--hidden');
    } else if (currentScrollY > lastScrollY) {
      // Scrolleando hacia abajo → ocultar
      nav.classList.add('nav-wrapper--hidden');
    } else {
      // Scrolleando hacia arriba → mostrar
      nav.classList.remove('nav-wrapper--hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
})();
