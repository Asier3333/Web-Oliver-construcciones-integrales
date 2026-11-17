# Tarjeta

Recuadro opaco que se levanta del fondo con sombra en capas; el contenedor por defecto para pasos, servicios y casos.

Marcado: `<article class="wp-tarjeta">` con `wp-tarjeta__numero` (opcional), `wp-tarjeta__titulo` y `wp-tarjeta__texto`. Tú pones el contenido.

- `wp-tarjeta--interactiva`: al pasar el cursor sube 6 px y pasa de `elev-2` a `elev-3`. Úsala cuando toda la tarjeta enlaza a algo.
- `wp-tarjeta--alzada`: fija el estado elevado. Una por rejilla, para la opción recomendada.
- `wp-tarjeta--destacada`: tiñe la superficie con `azul-velo`. Una por rejilla; suele ir con `--alzada`.
- Rejillas de dos o tres columnas con separación `esp-6`. Mismo alto en todas.
- En oscuro no hay sombra visible: la elevación la dan el filete y el brillo superior. No añadas bordes propios.
- Título de una o dos líneas; texto de tres como mucho.
