/* ── Pie: volver arriba ── */
(() => {
  'use strict';
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-arriba]').forEach(b => b.addEventListener('click', () => scrollTo({ top: 0, behavior: quieto ? 'auto' : 'smooth' })));
})();
