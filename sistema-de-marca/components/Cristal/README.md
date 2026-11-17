# Cristal

Recuadro translúcido con desenfoque que flota sobre un halo, una captura o un vídeo.

Marcado: `<div class="wp-cristal">…</div>`. Tú pones el contenido (un chip o `wp-tarjeta__numero`, un `wp-tarjeta__titulo`, una línea de texto) y, sobre todo, **lo que hay detrás**.

- Siempre encima de algo que se vea a través. Coloca un `<span class="wp-halo">` en la sección, parcialmente fuera del encuadre, o una imagen. Sobre fondo liso usa `Tarjeta`.
- Contenido breve: un dato, un estado, una nota. Para texto largo, `Tarjeta`.
- `wp-cristal--s` para piezas pequeñas (relleno `esp-6`, radio `radio-m`).
- Como mucho tres piezas de cristal por pantalla; nunca una dentro de otra.
- La sección que lo contiene necesita `position: relative; overflow: hidden` (`.wp-seccion` ya lo trae).
