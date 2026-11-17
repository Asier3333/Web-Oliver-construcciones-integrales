/* ── Páginas: cada [data-vista] es una página; la dirección (#nombre) decide cuál se ve ── */
(() => {
  'use strict';
  const vistas = [...document.querySelectorAll('[data-vista]')];
  const inicio = vistas[0];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const titulos = { inicio: 'Home de Web y Punto', 'clientes-fundadores': 'Oferta Clientes Fundadores · Web y Punto', contacto: 'Contacto · Web y Punto', proyectos: 'Nuestros proyectos · Web y Punto', equipo: 'Equipo · Web y Punto', privacidad: 'Política de privacidad · Web y Punto', terminos: 'Términos y condiciones · Web y Punto' };
  let actual = null;

  const ponTitulo = () => { const k = actual ? actual.dataset.vista : 'inicio', en = window.WYP && WYP.idioma === 'en'; document.title = (en && WYP.titulo(k)) || titulos[k] || titulos.inicio; };
  addEventListener('wyp:idioma', ponTitulo);

  const pon = (vista, destino) => {
    vistas.forEach(v => { v.hidden = v !== vista; });
    actual = vista;
    document.body.dataset.paginaActual = vista.dataset.vista;
    ponTitulo();
    document.querySelectorAll('[data-pagina]').forEach(a => {
      if (a.dataset.pagina === vista.dataset.vista) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    scrollTo({ top: 0, behavior: 'instant' });
    if (destino && destino !== vista) destino.scrollIntoView({ behavior: 'instant', block: 'start' });
    dispatchEvent(new Event('resize'));
    dispatchEvent(new Event('scroll'));
  };

  const resuelve = primera => {
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { id = ''; }
    const destino = id ? document.getElementById(id) : null;
    const vista = destino ? destino.closest('[data-vista]') : null;
    if (destino && !vista && !primera) return;               // un ancla fuera de las páginas (pie): no cambia nada
    const nueva = vista || inicio;
    if (nueva === actual) return;                             // misma página: el navegador ya se desplaza al ancla
    if (primera || quieto || !document.startViewTransition) pon(nueva, destino);
    else document.startViewTransition(() => pon(nueva, destino));
  };

  addEventListener('hashchange', () => resuelve(false));
  resuelve(true);
})();

/* ── Menú móvil a pantalla completa ── */
(() => {
  'use strict';
  const raiz = document.documentElement, cab = document.getElementById('cab');
  const boton = cab.querySelector('.nav__menu'), panel = document.getElementById('menu-movil');
  if (!boton || !panel) return;
  const fondo = [...document.querySelectorAll('[data-vista], footer, .wa')];
  let temaAntes = null, reloj = 0;

  const abre = () => {
    clearTimeout(reloj);
    const r = boton.getBoundingClientRect();
    panel.style.setProperty('--ox', (r.left + r.width / 2) + 'px');
    panel.style.setProperty('--oy', (r.top + r.height / 2) + 'px');
    if (!cab.classList.contains('menu-activo')) temaAntes = cab.dataset.theme;
    cab.dataset.theme = 'oscuro';
    cab.classList.add('abierto', 'menu-activo');
    panel.inert = false; panel.removeAttribute('aria-hidden');
    boton.setAttribute('aria-expanded', 'true'); boton.setAttribute('aria-label', 'Cerrar menú');
    raiz.style.overflow = 'hidden';
    fondo.forEach(el => { el.inert = true; });
  };
  const cierra = () => {
    if (!cab.classList.contains('abierto')) return;
    cab.classList.remove('abierto');
    panel.inert = true; panel.setAttribute('aria-hidden', 'true');
    boton.setAttribute('aria-expanded', 'false'); boton.setAttribute('aria-label', 'Abrir menú');
    raiz.style.overflow = '';
    fondo.forEach(el => { el.inert = false; });
    reloj = setTimeout(() => {                                // el nav recupera su tema cuando el panel ya se ha recogido
      cab.classList.remove('menu-activo');
      if (temaAntes) cab.dataset.theme = temaAntes;
      dispatchEvent(new Event('scroll'));
    }, 300);
  };

  boton.addEventListener('click', () => (cab.classList.contains('abierto') ? cierra() : abre()));
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', cierra));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && cab.classList.contains('abierto')) { cierra(); boton.focus(); } });
  matchMedia('(min-width: 1001px)').addEventListener('change', e => { if (e.matches) cierra(); });
})();
