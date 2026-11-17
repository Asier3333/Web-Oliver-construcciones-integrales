/* ── Página Nuestros proyectos: la linterna del hero y el número del siguiente proyecto ── */
(() => {
  'use strict';
  const vista = document.getElementById('pagina-proyectos');
  if (!vista) return;
  const $ = (s, r = vista) => r.querySelector(s);
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* El siguiente proyecto: uno más que los ya realizados (misma cifra que pinta la home) */
  const num = $('.pr-hueco__dentro .caso__num'), hechas = parseInt((document.querySelector('[data-plazas="ocupadas"]') || {}).textContent, 10);
  if (num && Number.isFinite(hechas)) num.textContent = String(hechas + 1).padStart(2, '0');

  /* Linterna: la luz sigue al cursor con un poco de inercia; si nadie mueve el cursor, pasea sola */
  const hero = $('#pr-hero'), muro = $('#muro');
  if (!hero || !muro || quieto || !('IntersectionObserver' in window)) return;
  let w = 0, h = 0, x = 0, y = 0, tx = 0, ty = 0, ultimo = -1e9, id = 0, visible = false;
  const mide = () => { const r = hero.getBoundingClientRect(); w = r.width; h = r.height; };
  const paso = t => {
    id = 0;
    if (!visible || vista.hidden) return;
    if (t - ultimo > 2600) {                                  // paseo automático
      tx = w * (0.5 + 0.34 * Math.sin(t / 2300));
      ty = h * (0.46 + 0.26 * Math.sin(t / 1700 + 1.2));
    }
    x += (tx - x) * 0.07; y += (ty - y) * 0.07;
    hero.style.setProperty('--lx', x.toFixed(1) + 'px');
    hero.style.setProperty('--ly', y.toFixed(1) + 'px');
    muro.style.setProperty('--dx', ((0.5 - x / w) * 46).toFixed(1) + 'px');
    muro.style.setProperty('--dy', ((0.5 - y / h) * 34).toFixed(1) + 'px');
    const r = hero.getBoundingClientRect();
    muro.style.setProperty('--rx', (56 + Math.min(1, Math.max(0, -r.top / (h || 1))) * 9).toFixed(2) + 'deg');
    id = requestAnimationFrame(paso);
  };
  const arranca = () => { if (!id && visible && !vista.hidden) { mide(); if (!x && !y) { x = tx = w / 2; y = ty = h * 0.4; } id = requestAnimationFrame(paso); } };
  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; ultimo = performance.now();
  });
  hero.addEventListener('pointerleave', () => { ultimo = -1e9; });
  addEventListener('resize', () => { mide(); arranca(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) arranca(); else { cancelAnimationFrame(id); id = 0; } }).observe(hero);
})();
