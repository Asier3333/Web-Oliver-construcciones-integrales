# Punto

La mascota señalando un elemento concreto de la página: un CTA, una cifra o una nota.

Marcado: `<div class="wp-punto"><img class="wp-punto__img" src="…" alt=""></div>`, con una nota opcional `<p class="wp-punto__nota">…</p>` a su lado. Tú eliges la pose (`assets/Punto/`) y lo colocas junto a lo que señala.

- `wp-punto--asomado`: lo posa sobre el borde superior de una `Tarjeta` o un `Cristal` (el contenedor ya es `position: relative`).
- `wp-punto--s` (64 px), por defecto 88 px, `wp-punto--l` (128 px). No más grande.
- `wp-punto--espejo` lo gira para que mire hacia lo que señala. Punto siempre mira o apunta al elemento, nunca hacia fuera de la página.
- Una vez por sección y tres por página como máximo. No en el nav, no en el pie, no como ilustración del hero.
- Sin bocadillos ni líneas de movimiento: lo que dice va en `wp-punto__nota`, en una frase.
- Es decorativo (`alt=""`); el mensaje está siempre en texto.
