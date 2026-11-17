/* ── Página Oferta Clientes Fundadores: comparador antes/después y plazas ── */
(() => {
  'use strict';
  const vista = document.getElementById('clientes-fundadores');
  if (!vista) return;
  const $ = (s, r = vista) => r.querySelector(s);
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const limita = (v, a = 0, b = 100) => Math.min(b, Math.max(a, v));

  /* Comparador: el punto azul separa la web de hoy (izquierda) de la nueva (derecha) */
  const caja = $('#comparador'), compara = $('#compara'), lienzo = $('#lienzo'), rango = $('#compara-rango');
  if (caja && lienzo) {
    let demo = 0;
    const pon = v => {
      v = limita(v, 0, 100);
      compara.style.setProperty('--corte', v + '%');
      caja.style.setProperty('--n', (1 - v / 100).toFixed(3));
      caja.classList.toggle('nueva-gana', v < 50);
      compara.classList.toggle('sin-antes', v < 16);
      compara.classList.toggle('sin-despues', v > 84);
      rango.value = Math.round(v);
      rango.setAttribute('aria-valuetext', `${Math.round(100 - v)} % de la web nueva a la vista`);
    };
    const para = () => { cancelAnimationFrame(demo); demo = 0; compara.classList.add('tocado'); };
    const desde = e => { const r = lienzo.getBoundingClientRect(); pon((e.clientX - r.left) / r.width * 100); };

    lienzo.addEventListener('pointerdown', e => {
      if (e.button) return;
      para(); compara.classList.add('arrastrando');
      try { lienzo.setPointerCapture(e.pointerId); } catch (err) { /* sin captura: seguimos con pointermove */ }
      desde(e);
    });
    lienzo.addEventListener('pointermove', e => { if (compara.classList.contains('arrastrando')) desde(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => lienzo.addEventListener(t, () => compara.classList.remove('arrastrando')));
    rango.addEventListener('input', () => { para(); pon(+rango.value); });
    pon(50);

    /* La primera vez que se ve, el punto se mueve solo para enseñar que se puede arrastrar */
    if (!quieto && 'IntersectionObserver' in window) {
      const tramos = [[50, 20, 1000], [20, 80, 1400], [80, 38, 1100]];
      const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const corre = () => {
        let i = 0, t0 = performance.now();
        const paso = t => {
          const [a, b, d] = tramos[i], p = Math.min(1, (t - t0) / d);
          pon(a + (b - a) * suave(p));
          if (p >= 1) { i++; t0 = t; if (i >= tramos.length) { demo = 0; return; } }
          demo = requestAnimationFrame(paso);
        };
        demo = requestAnimationFrame(paso);
      };
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting || compara.classList.contains('tocado')) return;
        io.disconnect(); setTimeout(() => { if (!compara.classList.contains('tocado')) corre(); }, 1500);
      }, { threshold: 0.55 });
      io.observe(lienzo);
    } else pon(38);
  }

  /* Plazas en el cierre: toma las cifras que ya pinta la home (una sola fuente) */
  const mini = $('#plazas-mini');
  if (mini) {
    const lee = k => parseInt((document.querySelector(`[data-plazas="${k}"]`) || {}).textContent, 10);
    const total = lee('total') || 10, ocupadas = Number.isFinite(lee('ocupadas')) ? lee('ocupadas') : 6;
    mini.setAttribute('aria-label', `${ocupadas} de ${total} plazas ocupadas`);
    for (let i = 0; i < total; i++) {
      const p = document.createElement('i');
      if (i >= ocupadas) { p.className = 'libre'; p.style.setProperty('--i', i - ocupadas); }
      mini.appendChild(p);
    }
  }
})();
