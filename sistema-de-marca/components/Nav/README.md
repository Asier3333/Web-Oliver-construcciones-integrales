# Nav

Barra de navegación flotante en píldora de cristal, fija arriba con 24 px de margen.

Marcado: `<nav class="wp-nav">` con el logo (`<img class="wp-nav__logo">`), la lista `<ul class="wp-nav__enlaces">` y un `wp-btn wp-btn--s` a la derecha. Tú pones los enlaces y el CTA.

- Logo: `logo-web-y-punto.svg` sobre secciones claras, `logo-web-y-punto-sobre-negro.svg` sobre negras. Si el nav es fijo y cruza ambas, cambia el `data-theme` del nav al entrar en cada sección.
- Máximo cinco enlaces. Marca el actual con `aria-current="page"`.
- El botón del nav es `--solido` cuando la pantalla ya tiene un `--primario` (el hero); `--primario` en el resto de páginas.
- En móvil: logo, botón y un menú; los enlaces pasan a una hoja de cristal a pantalla completa.
- Punto no aparece en el nav.
