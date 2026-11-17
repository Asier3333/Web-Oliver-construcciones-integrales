# Button

Botón en píldora para las acciones de la página; el primario azul es el único punto de la pantalla donde `azul` aparece como relleno.

Marcado: `<a class="wp-btn wp-btn--primario" href="…">Reserva tu plaza</a>` (o `<button>`). Tú pones el texto y el destino.

| Clase | Cuándo |
| --- | --- |
| `wp-btn--primario` | La acción principal. **Una por pantalla visible.** Lleva `azul-halo`. |
| `wp-btn--solido` | Segunda acción con peso: negro sobre claro, blanco sobre negro. También el botón del nav cuando el hero ya tiene un primario. |
| `wp-btn--cristal` | Acción secundaria sobre un halo, una imagen o un vídeo. |
| `wp-btn--texto` | Enlace con flecha: `<span class="wp-btn__flecha" aria-hidden="true">→</span>` al final. |
| `wp-btn--s` | Tamaño 36 px para nav y tarjetas. Combínalo con una variante. |

- Texto con verbo y mayúscula solo inicial, de dos a cuatro palabras. Sin signos de exclamación.
- No pongas dos primarios juntos ni un primario dentro de cada tarjeta de una rejilla.
- No cambies el radio ni añadas iconos a la izquierda.
