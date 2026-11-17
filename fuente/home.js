(() => {
  'use strict';

  /* ── Lo único que hay que tocar cuando cambie la oferta ── */
  const CONFIG = {
    plazasTotal: 10,
    plazasOcupadas: 6,
    whatsapp: '34693731980',
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const raiz = document.documentElement;

  /* ── Plazas ── */
  const libres = Math.max(0, CONFIG.plazasTotal - CONFIG.plazasOcupadas);
  const valores = { total: CONFIG.plazasTotal, ocupadas: CONFIG.plazasOcupadas, libres };
  $$('[data-plazas]').forEach(el => { el.textContent = valores[el.dataset.plazas]; });
  const casillas = $('#casillas');
  if (casillas) {
    casillas.setAttribute('aria-label', `${CONFIG.plazasOcupadas} de ${CONFIG.plazasTotal} plazas ocupadas`);
    for (let i = 0; i < CONFIG.plazasTotal; i++) {
      const c = document.createElement('span');
      const ocupada = i < CONFIG.plazasOcupadas;
      c.className = 'casilla ' + (ocupada ? 'ocupada' : 'libre');
      c.style.setProperty('--i', i);
      c.innerHTML = (ocupada ? '<svg class="ico"><use href="#i-check"/></svg>' : '') + String(i + 1).padStart(2, '0');
      casillas.appendChild(c);
    }
    $('#plazas').style.setProperty('--lleno', CONFIG.plazasOcupadas / CONFIG.plazasTotal);
  }

  /* ── Apariciones al entrar en pantalla ── */
  const alVer = (els, fn, opts = { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }) => {
    if (!('IntersectionObserver' in window)) { els.forEach(el => fn(el)); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }), opts);
    els.forEach(el => io.observe(el));
  };
  if (!quieto && 'IntersectionObserver' in window) {
    raiz.classList.add('js');
    alVer($$('.aparece'), el => el.classList.add('visto'));
  }

  /* Contador de plazas: casillas, barra y cifra */
  const plazas = $('#plazas');
  if (plazas) alVer([plazas], el => {
    el.classList.add('contado');
    $$('[data-cuenta]', el).forEach(n => {
      const fin = +n.textContent; if (quieto || !fin) return;
      const t0 = performance.now(), dur = 1400;
      const paso = t => { const p = limita((t - t0) / dur); n.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(paso); };
      n.textContent = 0; requestAnimationFrame(paso);
    });
  }, { threshold: 0.35 });

  /* ── Nav (el menú móvil y el cambio de página viven en el bloque común) ── */
  const cab = $('#cab');

  /* ── Todo lo que depende del scroll, en un solo bucle ── */
  const temas = $$('main [data-theme], footer[data-theme]');
  const secciones = [];   // las cuatro entradas del nav ya son páginas: ninguna apunta a una sección de la home
  const enlaceOferta = $('#menu a[data-pagina="clientes-fundadores"]');
  const enlaceContacto = $('#menu a[data-pagina="contacto"]');
  const enlaceProyectos = $('#menu a[data-pagina="proyectos"]');
  const enlaceEquipo = $('#menu a[data-pagina="equipo"]');
  const navegador = $('#navegador'), escena = $('#escena');
  const casos = $$('.caso'), dias = $('#dias'), listaDias = $$('.dia');
  const marca = $('.pie__marca'), wa = $('#wa'), hero = $('#inicio');
  const progreso = $('.progreso');
  let pendiente = false;

  const alScroll = () => {
    pendiente = false;
    const y = scrollY, alto = innerHeight;
    const total = raiz.scrollHeight - alto;
    progreso.style.setProperty('--leido', total > 0 ? limita(y / total) : 0);
    cab.classList.toggle('compacta', y > 40);
    wa.classList.toggle('on', y > hero.offsetHeight * 0.6);

    // el nav toma el tema de la sección que tiene debajo
    const linea = 16 + 32;
    let tema = 'claro';
    for (const s of temas) { const r = s.getBoundingClientRect(); if (r.top <= linea && r.bottom > linea) { tema = s.dataset.theme; } }
    if (!cab.classList.contains('menu-activo') && cab.dataset.theme !== tema) cab.dataset.theme = tema;

    // enlace activo
    let activa = null;
    for (const s of secciones) { const r = s.el.getBoundingClientRect(); if (r.top < alto * 0.45 && r.bottom > alto * 0.45) activa = s.id; }
    secciones.forEach(s => s.a.classList.toggle('activo', s.id === activa));
    enlaceOferta.classList.toggle('activo', document.body.dataset.paginaActual === 'clientes-fundadores');
    enlaceContacto.classList.toggle('activo', document.body.dataset.paginaActual === 'contacto');
    enlaceProyectos.classList.toggle('activo', document.body.dataset.paginaActual === 'proyectos');
    enlaceEquipo.classList.toggle('activo', document.body.dataset.paginaActual === 'equipo');

    if (quieto) return;

    // hero: la ventana se endereza al bajar
    if (navegador && innerWidth > 1000) {
      const r = escena.getBoundingClientRect();
      const p = limita(1 - (r.top - alto * 0.25) / (alto * 0.6));
      navegador.style.setProperty('--rx', (16 * (1 - p)).toFixed(2) + 'deg');
      navegador.style.setProperty('--sc', (0.94 + 0.06 * p).toFixed(3));
    }

    // portafolio: cada tarjeta se encoge cuando la siguiente la cubre
    if (innerWidth > 640) casos.forEach((c, i) => {
      const sig = casos[i + 1];
      if (!sig) return;
      const r = c.getBoundingClientRect(), rs = sig.getBoundingClientRect();
      const p = limita(1 - (rs.top - r.top) / r.height);
      c.style.setProperty('--esc', (1 - 0.06 * p).toFixed(3));
      c.style.setProperty('--vel', (0.55 * p).toFixed(3));
    });

    // semana: la línea avanza con el scroll
    if (dias) {
      const r = dias.getBoundingClientRect();
      const p = limita((alto * 0.78 - r.top) / Math.max(r.height, alto * 0.42));
      dias.style.setProperty('--avance', p.toFixed(3));
      listaDias.forEach((d, i) => d.classList.toggle('hecho', p >= (i + 0.35) / listaDias.length));
    }

    // pie: el nombre gigante sube
    if (marca) {
      const r = marca.getBoundingClientRect();
      marca.style.setProperty('--pie', limita((r.top - alto * 0.5) / (alto * 0.5)).toFixed(3));
    }
  };
  const pide = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); } };
  addEventListener('scroll', pide, { passive: true });
  addEventListener('resize', pide);
  if (dias && !quieto) dias.classList.add('vivo');
  alScroll();

  /* ── Hero: la web que se construye en 7 días ── */
  const diaN = $('#dia-n'), tramos = $$('.tramos i');
  const ponDia = d => {
    for (let n = 2; n <= 7; n++) navegador.classList.toggle('g' + n, d >= n);
    tramos.forEach((t, i) => t.classList.toggle('on', i < d));
    diaN.textContent = d;
  };
  if (navegador) {
    if (quieto) ponDia(7);
    else {
      let d = 1, espera = 0, reloj = null;
      ponDia(1);
      const tic = () => {
        if (d === 7 && espera < 2) { espera++; return; }
        espera = 0; d = d === 7 ? 1 : d + 1; ponDia(d);
      };
      new IntersectionObserver(([e]) => {
        clearInterval(reloj);
        if (e.isIntersecting) reloj = setInterval(tic, 1500);
      }, { threshold: 0.15 }).observe(navegador);
    }
  }

  /* ── Hero: cielo de puntos ── */
  const lienzo = $('.hero__cielo');
  if (lienzo && lienzo.getContext) {
    const ctx = lienzo.getContext('2d');
    let w = 0, h = 0, pts = [], vivo = false, id = 0;
    const mide = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = lienzo.clientWidth; h = lienzo.clientHeight;
      lienzo.width = w * dpr; lienzo.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(limita(w * h / 9000, 40, 170));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.3, v: Math.random() * 0.14 + 0.03, f: Math.random() * 6.28, azul: Math.random() < 0.18 }));
    };
    const pinta = t => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (vivo) { p.y -= p.v; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; } }
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t / 900 + p.f));
        ctx.fillStyle = p.azul ? `rgba(132,150,255,${a})` : `rgba(248,248,255,${a * 0.8})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      if (vivo) id = requestAnimationFrame(pinta);
    };
    mide(); pinta(0);
    addEventListener('resize', () => { mide(); if (!vivo) pinta(0); });
    if (!quieto) new IntersectionObserver(([e]) => {
      cancelAnimationFrame(id); vivo = e.isIntersecting;
      if (vivo) id = requestAnimationFrame(pinta);
    }).observe(lienzo);
  }

  /* ── Cursor: paralaje del hero, foco de luz, inclinación e imán ── */
  if (fino && !quieto) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
      hero.style.setProperty('--py', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
    });
    $$('.foco').forEach(el => el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--fx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--fy', (e.clientY - r.top) + 'px');
    }));
    $$('[data-inclina]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add('moviendo');
        el.style.setProperty('--iy', (x * 7).toFixed(2) + 'deg');
        el.style.setProperty('--ix', (-y * 6).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('moviendo'); el.style.setProperty('--ix', '0deg'); el.style.setProperty('--iy', '0deg'); });
    });
    $$('[data-iman]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 10}px, ${((e.clientY - r.top) / r.height - 0.5) * 8}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ── Portafolio: recorrido de la captura al pasar el cursor ── */
  const mideCapturas = () => $$('.marco__ventana').forEach(v => {
    const c = $('.captura', v); if (c) c.style.setProperty('--viaje', Math.min(0, v.clientHeight - c.offsetHeight) + 'px');
  });
  mideCapturas(); addEventListener('resize', mideCapturas); addEventListener('load', mideCapturas);

  /* ── Chat: la conversación se repite mientras se ve ── */
  const chat = $('#chat');
  if (chat && !quieto && 'IntersectionObserver' in window) {
    const [tu, escribe, resp, fin] = $$('.msj', chat);
    let turno = 0, reloj = null;
    const pasos = [
      () => { [escribe, resp, fin].forEach(m => m.classList.remove('on')); tu.classList.add('on'); },
      () => escribe.classList.add('on'),
      () => { escribe.classList.remove('on'); resp.classList.add('on'); },
      () => fin.classList.add('on'),
      () => {}, () => {},
    ];
    const esperas = [900, 1500, 1400, 2600, 400, 100];
    const sigue = () => { pasos[turno](); reloj = setTimeout(sigue, esperas[turno]); turno = (turno + 1) % pasos.length; };
    chat.classList.add('animado');
    new IntersectionObserver(([e]) => { clearTimeout(reloj); if (e.isIntersecting) { turno = 0; sigue(); } }, { threshold: 0.4 }).observe(chat);
  }

  /* El formulario de análisis y su aviso viven en el bloque del formulario (compartido con la página de contacto). */
})();
