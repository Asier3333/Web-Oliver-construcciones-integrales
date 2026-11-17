/* ── Página Contacto: saludo y hora, órbita, calendario, WhatsApp y análisis ── */
(() => {
  'use strict';
  const vista = document.getElementById('pagina-contacto');
  if (!vista) return;

  /* ── Lo que hay que tocar si cambia algo ── */
  const CONFIG = {
    calendly: 'https://calendly.com/marcossabel-agency/30min',
    whatsapp: '34693731980',
    zona: 'Europe/Madrid',
    diasHabiles: [1, 2, 3, 4, 5],   // 1 = lunes … 7 = domingo. Días que se pueden elegir en el calendario propio.
    mesesVista: 3,                  // cuántos meses se pueden recorrer
    incrustarCalendly: true,        // intenta mostrar el calendario real de Calendly donde el navegador lo permite
  };

  const $ = (s, r = vista) => r.querySelector(s);
  const $$ = (s, r = vista) => [...r.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visible = () => !vista.hidden;
  const ingles = () => !!window.WYP && WYP.idioma === 'en';
  const T = s => (window.WYP ? WYP.t(s) : s);              // el mismo texto, en el idioma activo

  /* ── Saludo según la hora de quien visita y reloj de Web y Punto ── */
  const saludo = $('#co-saludo'), hora = $('#co-hora');
  if (saludo) { const h = new Date().getHours(); saludo.textContent = h >= 6 && h < 13 ? 'Buenos días.' : h >= 13 && h < 21 ? 'Buenas tardes.' : 'Buenas noches.'; }
  if (hora) {
    let fmt = null;
    const prepara = () => { try { fmt = ingles() ? new Intl.DateTimeFormat(WYP.locale, { hour: 'numeric', minute: '2-digit', timeZone: CONFIG.zona }) : new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: CONFIG.zona }); } catch (e) { fmt = null; } };
    prepara();
    const pon = () => { hora.textContent = fmt ? fmt.format(new Date()) : new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); };
    pon(); setInterval(pon, 20000);
    addEventListener('wyp:idioma', () => { prepara(); pon(); });
  }

  /* ── Órbita: las tres formas de contacto giran alrededor del punto ── */
  const orbita = $('#orbita');
  if (orbita && !quieto) {
    const canales = $$('.orbita__canal', orbita);
    const ancho = matchMedia('(min-width: 761px)');
    let t = 0, antes = 0, id = 0, pausa = false;
    const inclina = -7 * Math.PI / 180, cosI = Math.cos(inclina), sinI = Math.sin(inclina);
    const paso = ahora => {
      id = 0;
      if (!ancho.matches || !visible()) return;
      const dt = Math.min(64, ahora - (antes || ahora)); antes = ahora;
      if (!pausa) t += dt * 0.00022;
      const A = Math.min(380, Math.max(200, (orbita.clientWidth - 200) / 2)), B = A * 0.295;
      canales.forEach((c, i) => {
        const a = t + i * (Math.PI * 2 / canales.length) + 0.5;
        const ex = A * Math.cos(a), ey = B * Math.sin(a), prof = Math.sin(a);   // prof > 0: delante del punto
        c.style.setProperty('--x', (ex * cosI - ey * sinI).toFixed(1) + 'px');
        c.style.setProperty('--y', (ex * sinI + ey * cosI).toFixed(1) + 'px');
        c.style.setProperty('--s', (0.86 + 0.14 * (prof + 1) / 2).toFixed(3));
        c.style.setProperty('--o', (0.62 + 0.38 * (prof + 1) / 2).toFixed(3));
        c.style.setProperty('--z', prof > 0 ? 3 : 1);
      });
      id = requestAnimationFrame(paso);
    };
    const arranca = () => { if (!id && ancho.matches && visible()) { antes = 0; id = requestAnimationFrame(paso); } };
    const suelta = () => canales.forEach(c => ['--x', '--y', '--s', '--o', '--z'].forEach(p => c.style.removeProperty(p)));
    orbita.addEventListener('pointerenter', () => { pausa = true; });
    orbita.addEventListener('pointerleave', () => { pausa = false; });
    orbita.addEventListener('focusin', () => { pausa = true; });
    orbita.addEventListener('focusout', () => { pausa = false; });
    ancho.addEventListener('change', e => { if (e.matches) arranca(); else { cancelAnimationFrame(id); id = 0; suelta(); } });
    if (!ancho.matches) suelta();
    new IntersectionObserver(([e]) => { if (e.isIntersecting) arranca(); else { cancelAnimationFrame(id); id = 0; } }).observe(orbita);
  }

  /* ── Calendario propio: eliges día y Calendly se abre en ese día ── */
  const dias = $('#ag-dias'), titulo = $('#ag-titulo'), punto = $('#ag-punto'), ir = $('#ag-ir'), elegido = $('#ag-elegido');
  if (dias && ir) {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const ini = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    let fMes, fDia;
    const formatos = () => {
      const loc = ingles() ? WYP.locale : 'es-ES';
      fMes = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' });
      fDia = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long' });
    };
    formatos();
    let mes = 0, sel = null;

    const colocaPunto = () => {
      const b = sel && dias.querySelector(`[data-fecha="${iso(sel)}"]`);
      if (!b) { punto.classList.remove('on'); return; }
      punto.style.setProperty('--px', (b.offsetLeft + b.offsetWidth / 2) + 'px');
      punto.style.setProperty('--py', (b.offsetTop + b.offsetHeight / 2) + 'px');
      punto.classList.add('on');
    };
    const pinta = anima => {
      const base = new Date(ini.getFullYear(), ini.getMonth() + mes, 1);
      titulo.textContent = fMes.format(base);
      $$('.agenda__dia, .agenda__hueco', dias).forEach(n => n.remove());
      const hueco = (base.getDay() + 6) % 7, total = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
      for (let i = 0; i < hueco; i++) { const h = document.createElement('span'); h.className = 'agenda__hueco'; dias.appendChild(h); }
      for (let n = 1; n <= total; n++) {
        const d = new Date(base.getFullYear(), base.getMonth(), n), b = document.createElement('button');
        const sem = d.getDay() || 7;
        b.type = 'button'; b.className = 'agenda__dia' + (d.getTime() === hoy.getTime() ? ' hoy' : '');
        b.textContent = n; b.dataset.fecha = iso(d); b.style.setProperty('--k', hueco + n);
        b.disabled = d < hoy || !CONFIG.diasHabiles.includes(sem);
        b.setAttribute('aria-label', fDia.format(d) + (b.disabled ? ', ' + T('no disponible') : ''));
        b.setAttribute('aria-pressed', String(!!sel && d.getTime() === sel.getTime()));
        dias.appendChild(b);
      }
      $('#ag-ant').disabled = mes <= 0; $('#ag-sig').disabled = mes >= CONFIG.mesesVista - 1;
      if (anima && !quieto) { dias.classList.remove('cambia'); void dias.offsetWidth; dias.classList.add('cambia'); }
      colocaPunto();
    };
    dias.addEventListener('click', e => {
      const b = e.target.closest('.agenda__dia'); if (!b || b.disabled) return;
      const [y, m, d] = b.dataset.fecha.split('-').map(Number); sel = new Date(y, m - 1, d);
      $$('.agenda__dia', dias).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      colocaPunto();
      elegido.textContent = fDia.format(sel);
      ir.textContent = 'Ver horas libres';
      ir.href = `${CONFIG.calendly}?month=${b.dataset.fecha.slice(0, 7)}&date=${b.dataset.fecha}`;
    });
    $('#ag-ant').addEventListener('click', () => { if (mes > 0) { mes--; pinta(true); } });
    $('#ag-sig').addEventListener('click', () => { if (mes < CONFIG.mesesVista - 1) { mes++; pinta(true); } });
    addEventListener('resize', colocaPunto);
    addEventListener('wyp:idioma', () => { formatos(); pinta(false); if (sel) elegido.textContent = fDia.format(sel); });
    pinta(false);
  }

  /* ── Calendly incrustado: solo se activa si su código llega a cargar (en vuestro dominio sí; en la vista previa de Claude no) ── */
  const agenda = $('#agenda'), propia = $('#agenda-propia'), real = $('#agenda-calendly'), alt = $('#agenda-alt');
  if (CONFIG.incrustarCalendly && agenda && real && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true;
      s.onload = () => {
        if (!window.Calendly || typeof window.Calendly.initInlineWidget !== 'function') return;
        try {
          real.hidden = false;
          window.Calendly.initInlineWidget({ url: `${CONFIG.calendly}?hide_event_type_details=1&primary_color=304ffe`, parentElement: real });
          propia.hidden = true; alt.hidden = false; agenda.classList.add('agenda--calendly');
        } catch (err) { real.hidden = true; propia.hidden = false; alt.hidden = true; }
      };
      document.head.appendChild(s);
    }, { rootMargin: '300px' });
    io.observe(agenda);
  }

  /* ── WhatsApp: eliges el tema y el mensaje se escribe solo ── */
  const texto = $('#co-wa-texto'), enviarWa = $('#co-wa-enviar'), temas = $$('.co-wa__tema');
  if (texto && enviarWa) {
    let reloj = 0, propuesto = texto.value;                  // el último mensaje que hemos escrito nosotros
    const enlaza = () => { enviarWa.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto.value.trim() || T('Hola.'))}`; };
    const escribe = t => {
      clearInterval(reloj); propuesto = t;
      if (quieto) { texto.value = t; enlaza(); return; }
      let i = 0; texto.value = '';
      reloj = setInterval(() => { i += 2; texto.value = t.slice(0, i); if (i >= t.length) { clearInterval(reloj); enlaza(); } }, 16);
    };
    temas.forEach(b => b.addEventListener('click', () => {
      temas.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      escribe(b.dataset.texto);
    }));
    texto.addEventListener('input', () => { clearInterval(reloj); enlaza(); });
    enviarWa.addEventListener('pointerdown', enlaza);
    /* Al cambiar de idioma, el mensaje propuesto cambia con él (si lo has editado tú, se respeta) */
    addEventListener('wyp:idioma', () => {
      const b = temas.find(x => x.getAttribute('aria-pressed') === 'true');
      if (b && (texto.value === propuesto || propuesto.startsWith(texto.value))) { clearInterval(reloj); propuesto = b.dataset.texto; texto.value = propuesto; }
      enlaza();
    });
    enlaza();
  }

  /* El formulario de análisis lo gestiona el bloque del formulario, igual que el de la home. */
})();
