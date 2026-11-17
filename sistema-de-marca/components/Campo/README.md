# Campo

Campo de formulario con etiqueta visible y ayuda opcional.

Marcado: `<label class="wp-campo">` con `wp-campo__etiqueta`, el `<input class="wp-campo__control">` y, si hace falta, `wp-campo__ayuda`. Tú pones etiqueta, tipo y placeholder.

- La etiqueta siempre visible encima; el placeholder es un ejemplo, no la etiqueta.
- Foco: borde `foco` y `foco-anillo`. No lo quites.
- Formularios cortos: tres campos como mucho antes del botón. El botón de envío es `wp-btn--primario` a ancho completo en móvil.
- Para `<textarea>`, la misma clase con `height: auto` y relleno vertical `esp-4`.
