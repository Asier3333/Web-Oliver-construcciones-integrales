/* ── Formulario de análisis (home y contacto): canal WhatsApp/correo y aviso de confirmación ── */
(() => {
  'use strict';

  /* ── Lo que hay que tocar si cambia algo ── */
  const CONFIG = {
    correo: 'info.webypunto@gmail.com',
    whatsapp: '34693731980',
    horasRespuesta: 24,
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cod = encodeURIComponent;
  const T = s => (window.WYP ? WYP.t(s) : s);              // el mismo texto, en el idioma activo

  /* ── Botones de copiar (dirección de correo) ── */
  $$('[data-copia]').forEach(b => {
    const antes = b.textContent;
    b.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(b.dataset.copia); ok = true; } catch (e) { ok = false; }
      b.textContent = ok ? (b.dataset.ok || 'Copiado') : b.dataset.copia;
      b.classList.toggle('copiado', ok);
      setTimeout(() => { b.textContent = antes; b.classList.remove('copiado'); }, 2200);
    });
  });

  /* ── Selector de canal en cada formulario ── */
  const ponCanal = (form, canal) => {
    const caja = $('.canal__opciones', form);
    if (caja) caja.dataset.canal = canal;
    $$('[data-ayuda]', form).forEach(p => { p.hidden = p.dataset.ayuda !== canal; });
  };
  const forms = $$('form[data-analisis]');
  forms.forEach(form => {
    $$('input[name="canal"]', form).forEach(r => r.addEventListener('change', () => ponCanal(form, r.value)));
    ponCanal(form, (form.canal && form.canal.value) || 'whatsapp');
  });

  /* ── Aviso ── */
  const aviso = $('#aviso');
  if (!aviso || !forms.length) return;
  const caja = $('#aviso-caja'), pEnviar = $('.aviso__paso--enviar', aviso), pHecho = $('.aviso__paso--hecho', aviso);
  const enviar = $('#aviso-enviar'), gmail = $('#aviso-gmail'), direccion = $('#aviso-direccion'), cambia = $('#aviso-cambia');
  const fondo = $$('[data-vista], header, footer, .wa');
  let datos = null, origen = null, paso = 1, reloj = 0;

  const mensaje = d => [T('Hola, quiero el análisis web gratuito.'), `${T('Web')}: ${d.web}`, `${T('Nombre')}: ${d.nombre}`, d.mejora ? `${T('Me gustaría mejorar')}: ${d.mejora}` : ''].filter(Boolean).join('\n');
  const pintaEnviar = () => {
    const texto = mensaje(datos), asunto = `${T('Análisis web gratuito')}: ${datos.web}`, esCorreo = datos.canal === 'correo';
    $('#aviso-web').textContent = datos.web; $('#aviso-nombre').textContent = datos.nombre;
    $('#aviso-como').textContent = esCorreo
      ? 'Se abre tu correo con el mensaje ya escrito. Pulsa enviar y listo.'
      : 'Se abre WhatsApp con el mensaje ya escrito. Pulsa enviar y listo.';
    enviar.href = esCorreo ? `mailto:${CONFIG.correo}?subject=${cod(asunto)}&body=${cod(texto)}` : `https://wa.me/${CONFIG.whatsapp}?text=${cod(texto)}`;
    if (esCorreo) enviar.removeAttribute('target'); else enviar.target = '_blank';
    $('use', enviar).setAttribute('href', esCorreo ? '#i-correo' : '#i-chat');
    $('span', enviar).textContent = esCorreo ? 'Abrir mi correo y enviar' : 'Abrir WhatsApp y enviar';
    gmail.hidden = !esCorreo; direccion.hidden = !esCorreo;
    gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${cod(CONFIG.correo)}&su=${cod(asunto)}&body=${cod(texto)}`;
    cambia.firstChild.textContent = esCorreo ? 'Prefiero enviarlo por WhatsApp ' : 'Prefiero enviarlo por correo ';
    $('#aviso-donde').textContent = esCorreo ? 'tu correo' : 'WhatsApp';
  };
  const ponPaso = n => {
    paso = n; clearTimeout(reloj);
    pEnviar.hidden = n !== 1; pHecho.hidden = n !== 2;
    caja.setAttribute('aria-labelledby', n === 1 ? 'aviso-t1' : 'aviso-t2');
    if (n === 2) {
      const fin = new Date(Date.now() + CONFIG.horasRespuesta * 3600000);
      const en = !!window.WYP && WYP.idioma === 'en', loc = en ? WYP.locale : 'es-ES';
      const dia = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long' }).format(fin);
      const hora = new Intl.DateTimeFormat(loc, { hour: en ? 'numeric' : '2-digit', minute: '2-digit' }).format(fin);
      $('#aviso-plazo').textContent = `${dia}, ${T('a las')} ${hora}`;
      const chispas = $('#aviso-chispas'); chispas.textContent = '';
      if (!quieto) for (let i = 0; i < 18; i++) {
        const p = document.createElement('i');
        p.style.setProperty('--a', (i * 20 + Math.random() * 14) + 'deg');
        p.style.setProperty('--r', (90 + Math.random() * 90) + 'px');
        p.style.setProperty('--t', (5 + Math.random() * 7).toFixed(1) + 'px');
        p.style.setProperty('--d', (Math.random() * 0.18).toFixed(2) + 's');
        p.style.setProperty('--c', ['#304ffe', '#8496ff', '#f8f8ff'][i % 3]);
        chispas.appendChild(p);
      }
      const ok = $('[data-cierra].wp-btn', pHecho); if (ok) ok.focus({ preventScroll: true });
    }
  };
  const abre = (d, form) => {
    datos = d; origen = form; pintaEnviar(); ponPaso(1);
    aviso.classList.remove('cierra'); aviso.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    fondo.forEach(el => { el.inert = true; });
    enviar.focus({ preventScroll: true });
  };
  const cierra = () => {
    if (aviso.hidden) return;
    clearTimeout(reloj);
    const hecho = paso === 2;
    const fin = () => {
      aviso.hidden = true; aviso.classList.remove('cierra');
      document.documentElement.style.overflow = '';
      fondo.forEach(el => { el.inert = false; });
      if (origen) {
        if (hecho) { origen.reset(); ponCanal(origen, 'whatsapp'); }
        const b = $('button[type="submit"]', origen); if (b) b.focus({ preventScroll: true });
      }
    };
    if (quieto) fin(); else { aviso.classList.add('cierra'); setTimeout(fin, 280); }
  };

  /* Al abrir WhatsApp o el correo pasamos a la confirmación: al volver a la página ya está ahí */
  [enviar, gmail].forEach(a => a.addEventListener('click', () => { clearTimeout(reloj); reloj = setTimeout(() => ponPaso(2), 900); }));
  cambia.addEventListener('click', () => { datos.canal = datos.canal === 'correo' ? 'whatsapp' : 'correo'; pintaEnviar(); enviar.focus({ preventScroll: true }); });
  $('#aviso-volver').addEventListener('click', () => { ponPaso(1); enviar.focus({ preventScroll: true }); });
  $$('[data-cierra]', aviso).forEach(b => b.addEventListener('click', cierra));
  document.addEventListener('keydown', e => {
    if (aviso.hidden) return;
    if (e.key === 'Escape') { cierra(); return; }
    if (e.key !== 'Tab') return;                              // el foco no sale del aviso
    const f = $$('a[href], button', caja).filter(el => !el.hidden && el.offsetParent !== null);
    if (!f.length) return;
    const pri = f[0], ult = f[f.length - 1];
    if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  });

  /* ── Envío del formulario: valida y abre el aviso ── */
  forms.forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const web = form.web.value.trim(), nombre = form.nombre.value.trim(), mejora = form.mejora.value.trim();
    const webVale = web.length > 3 && web.includes('.'), vale = webVale && nombre.length > 1;
    const error = $('.analisis__error', form); if (error) error.classList.toggle('on', !vale);
    if (!vale) { (webVale ? form.nombre : form.web).focus(); return; }
    abre({ web, nombre, mejora, canal: (form.canal && form.canal.value) || 'whatsapp' }, form);
  }));
})();
