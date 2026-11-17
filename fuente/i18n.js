/* ── Idioma: el inglés es una capa por encima de la web en español ──
   El contenido de la página es el español y no se toca. En inglés, cada texto se sustituye por su traducción
   y se guarda el original para poder volver. Las traducciones están en el diccionario EN (español → inglés). */
window.WYP = (() => {
  'use strict';

  /* ── Lo que hay que tocar si cambia algo ── */
  const CONFIG = {
    detectar: true,          // primera visita: español si el navegador está en español, catalán, gallego o euskera; inglés en el resto
    clave: 'wyp-idioma',     // dónde se recuerda el idioma elegido
  };

  const EN = /*DICCIONARIO*/{};

  /* Titulares con una palabra por pieza y textos que otro bloque trocea: se traducen enteros */
  const BLOQUES = [
    { sel: '#inicio h1', en: `
      <span class="pal" style="--i:0">A</span> <span class="pal" style="--i:1">website</span> <span class="pal" style="--i:2">worthy</span> <span class="pal" style="--i:3">of</span> <span class="pal" style="--i:4">your</span> <span class="pal" style="--i:5">business.</span>
      <span class="ypunto"><span class="pal" style="--i:7">Period</span><span class="punto-final" aria-hidden="true"></span><span class="sr">.</span></span>
    ` },
    { sel: '.of-hero h1', en: `
      <span class="pal" style="--i:0">From</span> <span class="pal" style="--i:1">the</span> <span class="pal" style="--i:2">site</span> <span class="pal" style="--i:3">you</span> <span class="pal" style="--i:4">have</span>
      <span class="of-hero__dos"><span class="pal" style="--i:6">to</span> <span class="pal" style="--i:7">the</span> <span class="pal" style="--i:8">one</span> <span class="pal" style="--i:9">you</span> <span class="pal" style="--i:10">deserve</span><span class="punto-final" aria-hidden="true"></span><span class="sr">.</span></span>
    ` },
  ];
  const HTML = {
    manifiesto: 'We’re a team of <em>two</em>. We work on <em>three projects</em> at a time, at most. You always talk to the person designing your website. You see every step in your client portal. And in <em>seven days</em>, your website is live.',
  };
  const TITULOS = { inicio: 'Web y Punto · Web design for small businesses', 'clientes-fundadores': 'Founding Clients Offer · Web y Punto', contacto: 'Contact · Web y Punto', proyectos: 'Our projects · Web y Punto', equipo: 'Team · Web y Punto', privacidad: 'Privacy policy · Web y Punto', terminos: 'Terms and conditions · Web y Punto' };

  const LETRAS = { L: 'M', M: 'T', X: 'W', J: 'T', V: 'F', S: 'S', D: 'S' };   // iniciales de los días de la semana
  const SEL_LETRAS = '.agenda__sem span, .pv-semana b';
  const PATRONES = [[/^(\d+) de (\d+) plazas ocupadas$/, '$1 of $2 spots taken']];
  /* Lo que no se traduce: las webs de los clientes (están en español), lo que escribe quien visita y el propio selector */
  const SALTA = '.captura, .azulejo:not(.azulejo--tuyo), .foto__movil, .foto__detalle, .marco__barra, #eq-manifiesto, .idioma, textarea, script, style, svg';
  const SALTA_ATR = '.captura, .azulejo:not(.azulejo--tuyo), .foto__movil, .foto__detalle, .marco__barra, .idioma button';
  const ATRIBUTOS = ['aria-label', 'placeholder', 'title', 'alt', 'data-texto', 'data-ok'];
  const SEL_ATR = ATRIBUTOS.map(a => `[${a}]`).join(',');
  const WA_ES = encodeURIComponent('Hola, vengo de vuestra web y quiero información.');
  const WA_EN = encodeURIComponent('Hi, I’m coming from your website and I’d like some information.');

  const raiz = document.documentElement;
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiene = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  /* ── Qué idioma toca al entrar ── */
  const lee = () => { try { return localStorage.getItem(CONFIG.clave); } catch (e) { return null; } };
  const guarda = v => { try { localStorage.setItem(CONFIG.clave, v); } catch (e) { /* sin almacenamiento: vale solo para esta visita */ } };
  const navegador = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
  const inicial = () => {
    let q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { q = null; }   // enlaces del tipo tudominio.com/?lang=en
    if (q === 'en' || q === 'es') return q;
    const g = lee();
    if (g === 'en' || g === 'es') return g;
    if (!CONFIG.detectar) return 'es';
    return /^(es|ca|gl|eu)\b/i.test(navegador) ? 'es' : 'en';
  };
  let idioma = inicial();

  /* ── Traducción de un texto suelto ── */
  const busca = (v, padre) => {
    const k = v.replace(/\s+/g, ' ').trim();
    if (!k || !/[A-Za-zÀ-ÿ]/.test(k)) return null;
    if (padre && tiene(LETRAS, k) && padre.matches(SEL_LETRAS)) return LETRAS[k];
    if (tiene(EN, k)) return EN[k];
    for (const [re, a] of PATRONES) if (re.test(k)) return k.replace(re, a);
    return null;
  };

  /* ── Capa sobre la página ── */
  const reg = new WeakMap(), regA = new WeakMap();           // texto o atributo → { es, en }
  let bloques = [], botones = [];
  const enBloque = n => bloques.some(b => b.el.contains(n));

  const texto = n => {
    const p = n.parentElement;
    if (!p || p.closest(SALTA) || enBloque(p)) return;
    const v = n.nodeValue, r = reg.get(n);
    if (r && v === r.en) return;                             // es lo que acabamos de escribir nosotros
    const en = busca(v, p);
    if (en === null) { if (r) reg.delete(n); return; }
    const fuera = (en.startsWith(' ') ? '' : v.match(/^\s*/)[0]) + en + (en.endsWith(' ') ? '' : v.match(/\s*$/)[0]);
    reg.set(n, { es: v, en: fuera });
    if (fuera !== v) n.nodeValue = fuera;
  };
  const atributos = (el, solo) => {
    if (el.closest(SALTA_ATR)) return;
    (solo ? [solo] : ATRIBUTOS).forEach(a => {
      if (!el.hasAttribute(a)) return;
      const v = el.getAttribute(a), m = regA.get(el) || {}, r = m[a];
      if (r && v === r.en) return;
      const en = busca(v, null);
      if (en === null) { if (r) { delete m[a]; regA.set(el, m); } return; }
      m[a] = { es: v, en }; regA.set(el, m);
      if (en !== v) el.setAttribute(a, en);
    });
  };
  const recorre = base => {
    const w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT), nodos = [];
    let n; while ((n = w.nextNode())) nodos.push(n);
    nodos.forEach(texto);
    if (base.matches && base.matches(SEL_ATR)) atributos(base);
    base.querySelectorAll(SEL_ATR).forEach(el => atributos(el));
  };
  const restaura = () => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { const r = reg.get(n); if (r) { if (n.nodeValue === r.en) n.nodeValue = r.es; reg.delete(n); } }
    document.querySelectorAll(SEL_ATR).forEach(el => {
      const m = regA.get(el); if (!m) return;
      Object.keys(m).forEach(a => { if (el.getAttribute(a) === m[a].en) el.setAttribute(a, m[a].es); });
      regA.delete(el);
    });
  };
  const whatsapp = (de, a) => document.querySelectorAll('a[href*="wa.me/"]').forEach(e => {
    const h = e.getAttribute('href'); if (h.endsWith('?text=' + de)) e.setAttribute('href', h.replace(de, a));
  });

  /* Lo que otros bloques escriben mientras la web está en inglés (avisos, botones que cambian de texto) también se traduce */
  const vigia = new MutationObserver(cambios => cambios.forEach(c => {
    if (c.type === 'characterData') texto(c.target);
    else if (c.type === 'attributes') atributos(c.target, c.attributeName);
    else c.addedNodes.forEach(n => { if (n.nodeType === 3) texto(n); else if (n.nodeType === 1) recorre(n); });
  }));

  const cambia = nuevo => {
    idioma = nuevo; raiz.lang = nuevo;
    if (nuevo === 'en') {
      recorre(document.body);
      bloques.forEach(b => { if (b.es === undefined) b.es = b.el.innerHTML; b.el.innerHTML = b.en; });
      whatsapp(WA_ES, WA_EN);
      vigia.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
    } else {
      vigia.disconnect(); vigia.takeRecords();
      restaura();
      bloques.forEach(b => { if (b.es !== undefined) b.el.innerHTML = b.es; });
      whatsapp(WA_EN, WA_ES);
    }
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.idioma === nuevo)));
    dispatchEvent(new CustomEvent('wyp:idioma', { detail: { idioma: nuevo } }));   // fechas, calendario y títulos se rehacen en su bloque
    dispatchEvent(new Event('resize')); dispatchEvent(new Event('scroll'));
  };

  /* Al elegir idioma, lo que estabas leyendo se queda donde estaba aunque los textos midan distinto */
  const elige = nuevo => {
    if (nuevo === idioma || (nuevo !== 'en' && nuevo !== 'es')) return;
    guarda(nuevo);
    const haz = () => {
      const ancla = document.elementFromPoint(innerWidth / 2, innerHeight * 0.45);
      const antes = ancla ? ancla.getBoundingClientRect().top : 0;
      cambia(nuevo);
      if (ancla && ancla.isConnected && scrollY > 0) scrollBy({ top: ancla.getBoundingClientRect().top - antes, behavior: 'instant' });
    };
    if (document.startViewTransition && !quieto) document.startViewTransition(haz); else haz();
  };

  return {
    get idioma() { return idioma; },
    get locale() { return idioma === 'en' ? (/^en\b/i.test(navegador) ? navegador : 'en-US') : 'es-ES'; },
    t: s => (idioma === 'en' && tiene(EN, s) ? EN[s] : s),
    html: k => HTML[k],
    titulo: k => TITULOS[k],
    pon: elige,
    /* Se llama al final, cuando el resto de la página ya está montada */
    arranca() {
      bloques = BLOQUES.map(b => ({ el: document.querySelector(b.sel), en: b.en })).filter(b => b.el);
      botones = [...document.querySelectorAll('[data-idioma]')];
      botones.forEach(b => b.addEventListener('click', () => elige(b.dataset.idioma)));
      if (idioma === 'en') cambia('en');                     // en español no hay nada que hacer: la página ya lo está
    },
  };
})();
