/* ── Página Equipo: hilos de luz del hero, manifiesto que se ilumina y carril de fotos ── */
(() => {
  'use strict';
  const vista = document.getElementById('pagina-equipo');
  if (!vista) return;
  const $ = (s, r = vista) => r.querySelector(s);
  const $$ = (s, r = vista) => [...r.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ── Hero: de cada fundador salen hilos con puntos de luz que viajan hasta «tu web» ── */
  const duo = $('#duo'), lienzo = duo && $('.duo__hilos', duo);
  if (lienzo && lienzo.getContext) {
    const ctx = lienzo.getContext('2d'), nodo = $('.duo__nodo', duo), fotos = $$('.duo__foto', duo);
    const HILOS = [-0.5, -0.2, 0.12, 0.42];                   // curvatura de cada hilo
    let w = 0, h = 0, rutas = [], chispas = [], id = 0, visible = false, activo = -1;
    const mide = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), r = lienzo.getBoundingClientRect();
      w = r.width; h = r.height; if (!w || !h) return false;
      lienzo.width = w * dpr; lienzo.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = nodo.getBoundingClientRect(), fin = { x: n.left + n.width / 2 - r.left, y: n.top + n.height / 2 - r.top };
      rutas = [];
      fotos.forEach((f, lado) => {
        const b = f.getBoundingClientRect(), c = { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top };
        const dx = fin.x - c.x, dy = fin.y - c.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
        let ini = { x: c.x + ux * b.width / 2, y: c.y + uy * b.height / 2 };
        if (Math.abs(dy) > Math.abs(dx) && dy > 0) {            // apilados (móvil): el de arriba lanza los hilos desde debajo de su nombre
          const pie = f.closest('.duo__persona').getBoundingClientRect();
          ini = { x: c.x, y: pie.bottom - r.top + 10 };
        }
        const largo = Math.hypot(fin.x - ini.x, fin.y - ini.y);
        HILOS.forEach(k => {
          const nx = -uy, ny = ux, a = k * Math.min(120, largo * 0.55);
          rutas.push({ lado, p0: ini, p1: { x: ini.x + ux * largo * 0.33 + nx * a, y: ini.y + uy * largo * 0.33 + ny * a }, p2: { x: ini.x + ux * largo * 0.72 + nx * a * 0.5, y: ini.y + uy * largo * 0.72 + ny * a * 0.5 }, p3: fin });
        });
      });
      if (!chispas.length) chispas = Array.from({ length: 30 }, (_, i) => ({ r: i % (HILOS.length * 2), t: Math.random(), v: 0.0016 + Math.random() * 0.0022, s: 1.2 + Math.random() * 1.6 }));
      return true;
    };
    const punto = (q, t) => { const u = 1 - t; return { x: u * u * u * q.p0.x + 3 * u * u * t * q.p1.x + 3 * u * t * t * q.p2.x + t * t * t * q.p3.x, y: u * u * u * q.p0.y + 3 * u * u * t * q.p1.y + 3 * u * t * t * q.p2.y + t * t * t * q.p3.y }; };
    const pinta = () => {
      ctx.clearRect(0, 0, w, h);
      rutas.forEach(q => {
        const g = ctx.createLinearGradient(q.p0.x, q.p0.y, q.p3.x, q.p3.y);
        g.addColorStop(0, 'rgba(132,150,255,0)'); g.addColorStop(0.5, q.lado === activo ? 'rgba(132,150,255,.5)' : 'rgba(132,150,255,.22)'); g.addColorStop(1, 'rgba(48,79,254,.75)');
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(q.p0.x, q.p0.y); ctx.bezierCurveTo(q.p1.x, q.p1.y, q.p2.x, q.p2.y, q.p3.x, q.p3.y); ctx.stroke();
      });
      chispas.forEach(c => {
        const q = rutas[c.r]; if (!q) return;
        const p = punto(q, c.t), a = Math.sin(Math.PI * c.t);
        ctx.fillStyle = `rgba(248,248,255,${(0.25 + 0.75 * a).toFixed(3)})`; ctx.shadowColor = 'rgba(48,79,254,1)'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(p.x, p.y, c.s * (0.6 + 0.6 * c.t), 0, 6.283); ctx.fill();
      });
      ctx.shadowBlur = 0;
    };
    const paso = () => {
      id = 0; if (!visible || vista.hidden) return;
      chispas.forEach(c => { const q = rutas[c.r]; c.t += c.v * (q && q.lado === activo ? 2.6 : 1); if (c.t >= 1) { c.t = 0; c.r = Math.floor(Math.random() * rutas.length); } });
      pinta(); id = requestAnimationFrame(paso);
    };
    const arranca = () => { if (!mide()) return; if (quieto) { chispas.forEach((c, i) => { c.t = (i % 6 + 1) / 7; }); pinta(); return; } if (!id && visible) id = requestAnimationFrame(paso); };
    fotos.forEach((f, i) => { f.addEventListener('pointerenter', () => { activo = i; }); f.addEventListener('pointerleave', () => { activo = -1; }); });
    addEventListener('resize', () => { if (!vista.hidden) arranca(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) arranca(); else { cancelAnimationFrame(id); id = 0; } }).observe(duo);
    else { visible = true; arranca(); }
  }

  /* ── Manifiesto: las palabras se encienden a medida que bajas ── */
  const man = $('#eq-manifiesto');
  if (man) {
    const es = man.innerHTML;                                // el texto en español, tal cual está en la página
    const parte = nodo => [...nodo.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(' ')); else { const s = document.createElement('span'); s.className = 'p'; s.textContent = t; f.appendChild(s); } });
        n.replaceWith(f);
      } else if (n.nodeType === 1) parte(n);
    });
    let palabras = [], pend = false;
    const monta = () => { if (quieto) return; parte(man); man.classList.add('vivo'); palabras = $$('.p', man); };
    const enciende = () => {
      pend = false; if (vista.hidden || quieto) return;
      const r = man.getBoundingClientRect(), alto = innerHeight;
      const p = limita((alto * 0.82 - r.top) / (r.height + alto * 0.34));
      const hasta = Math.round(p * palabras.length);
      palabras.forEach((s, i) => s.classList.toggle('on', i < hasta));
    };
    const pide = () => { if (!pend) { pend = true; requestAnimationFrame(enciende); } };
    monta();
    if (!quieto) { addEventListener('scroll', pide, { passive: true }); addEventListener('resize', pide); enciende(); }
    addEventListener('wyp:idioma', () => { man.innerHTML = (window.WYP && WYP.idioma === 'en' && WYP.html('manifiesto')) || es; monta(); enciende(); });
  }

  /* ── Carril de fotos: flechas y arrastre con el ratón ── */
  const carril = $('#eq-carril');
  if (carril) {
    const ant = $('#eq-ant'), sig = $('#eq-sig');
    const salto = () => Math.max(260, carril.clientWidth * 0.6);
    const estado = () => { if (!ant) return; ant.disabled = carril.scrollLeft < 8; sig.disabled = carril.scrollLeft > carril.scrollWidth - carril.clientWidth - 8; };
    if (ant) { ant.addEventListener('click', () => carril.scrollBy({ left: -salto(), behavior: quieto ? 'auto' : 'smooth' })); sig.addEventListener('click', () => carril.scrollBy({ left: salto(), behavior: quieto ? 'auto' : 'smooth' })); }
    carril.addEventListener('scroll', estado, { passive: true }); addEventListener('resize', estado); estado();
    let x0 = 0, s0 = 0, baja = false;
    carril.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; baja = true; x0 = e.clientX; s0 = carril.scrollLeft; });
    addEventListener('pointermove', e => { if (!baja) return; const d = e.clientX - x0; if (Math.abs(d) > 4) carril.classList.add('arrastra'); carril.scrollLeft = s0 - d; });
    addEventListener('pointerup', () => { baja = false; carril.classList.remove('arrastra'); });
  }
})();
