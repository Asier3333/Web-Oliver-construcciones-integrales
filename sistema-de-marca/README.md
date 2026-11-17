Web y Punto diseña webs a medida para PYMES. La marca se ve como un producto caro y se lee como una persona cercana: mucho aire, tipografía grande, blanco y negro, y un solo acento azul.

## Esencia

- **Profesional y exclusiva en lo visual, clara y directa en el texto.** El precio de lanzamiento es accesible; el aspecto no lo delata.
- **Un solo acento.** Blanco, negro y azul. Nada más: ni degradados de colores, ni segundo acento.
- **Profundidad, no decoración.** Lo que importa se levanta del fondo (tarjeta) o flota sobre él (cristal). Lo demás es plano.
- **Transparencia.** El proceso se enseña: capturas reales, estados reales, cifras concretas.

## Voz y contenido

- Trata de tú. Frases cortas. Primero el resultado, luego el cómo: «Tu web profesional, lista en 7 días, con todo el proceso a la vista.»
- Cifras concretas antes que adjetivos: «7 días», «3 webs a la vez», «10 plazas».
- Mayúscula solo inicial en titulares y botones («Reserva tu plaza», «Auditoría web gratuita»). Nunca mayúsculas sostenidas.
- Titulares que terminan en punto. Es el gesto de la marca: «Solo tres webs a la vez. La tuya es una.»
- Sin signos de exclamación en titulares ni botones. Sin emojis en la web ni en documentos; en WhatsApp con clientes, a criterio de quien escribe.
- Botones con verbo: «Reserva tu plaza», «Pedir mi análisis», «Ver nuestros proyectos».

## Color

Reparto 60 / 30 / 10, medido sobre la página entera:

- **60 % blanco** — `fondo` en tema claro (`#f8f8ff`). Es el fondo por defecto de toda sección.
- **30 % negro** — `fondo` en tema oscuro (`#000000`). Pon `data-theme="oscuro"` en la sección: úsalo en el hero, en una sección de escaparate (portafolio o oferta) y en el pie. Aproximadamente una sección de cada tres.
- **10 % azul** — `azul` (`#304ffe`). Solo en: el CTA primario, enlaces, el punto del logo, Punto y los halos (`.wp-halo`).

Reglas:

- Un único `.wp-btn--primario` por pantalla visible. Si hay dos acciones, la segunda es `--solido`, `--cristal` o `--texto`.
- `azul` nunca es fondo de sección ni de tarjeta. Para teñir, `azul-velo`.
- Texto sobre un relleno azul: `sobre-azul`.
- Texto y enlaces azules: `azul-texto`, no `azul`. Sobre negro, `#304ffe` solo alcanza 3,7:1; `azul-texto` se aclara en oscuro para llegar a 7:1.
- Texto: `tinta` para titulares y cuerpo, `tinta-suave` para entradillas, `tinta-tenue` para notas. No inventes grises.
- Alterna secciones enteras. No mezcles tarjetas negras dentro de una sección clara salvo `.wp-seccion--insertada`.

## Tipografía

Una sola familia, Geist (`font-sans`), con la fuente del sistema de Apple como respaldo.

- Titulares en peso 600 con interlineado apretado y tracking negativo: `titular-xl` (hero, uno por página), `titular-l`, `titular-m`, `titular-s`, `titular-xs`.
- Texto en peso 400: `entradilla` bajo cada titular en `tinta-suave`, `texto` para cuerpo, `texto-s` para notas.
- `etiqueta` para chips y nav. `cifra` para números destacados.
- Máximo 60–70 caracteres por línea. Titulares con `.wp-equilibrado` para que no dejen una palabra suelta.
- En móvil el hero baja a `titular-m` y las secciones a `titular-s`.
- No uses negrita dentro de un párrafo para decorar; una palabra en `.wp-acento` como mucho por titular.

## Profundidad

Tres niveles. Cada elemento está en uno solo.

1. **Plano** — texto, cifras y filetes (`linea`) directamente sobre `fondo`.
2. **Elevado** — `.wp-tarjeta`: superficie opaca `fondo-elevado` con `elev-2`. Al pasar el cursor sube 6 px y pasa a `elev-3`. Para contenido que se lee: pasos, servicios, casos.
3. **Cristal** — `.wp-cristal`, `.wp-nav`, `.wp-chip`: relleno `cristal`, filete `cristal-borde`, canto `cristal-brillo` y `desenfoque-cristal`. Para lo que flota sobre algo: el nav, datos sobre el hero, notas sobre una imagen.

Reglas:

- El cristal necesita algo detrás que se vea a través: un `.wp-halo`, una captura o un vídeo. Sobre un fondo liso es solo una caja gris; usa `.wp-tarjeta`.
- En negro la elevación la da el brillo del canto superior y el resplandor azul de `elev-3`, no la sombra. No añadas sombras negras sobre negro.
- No apiles cristal sobre cristal. No pongas más de tres piezas de cristal en una pantalla.
- El halo es siempre azul y siempre uno por sección, parcialmente fuera del encuadre.

## Forma, espaciado y composición

- Radios grandes y constantes: `radio-l` en tarjetas, `radio-xl` en paneles y marcos de captura, `radio-pill` en botones, chips y nav, `radio-m` en campos.
- Ancho de contenido 1120 px (`.wp-ancho`). Relleno vertical de sección `esp-32` en escritorio y `esp-16` en móvil.
- De titular a rejilla, `esp-12`; entre tarjetas, `esp-6`; relleno de tarjeta, `esp-8`.
- Hero centrado; el resto de secciones alineadas a la izquierda con el titular ocupando como mucho dos tercios del ancho.
- Deja vacío. Una idea por sección; si una sección necesita más de un titular y una rejilla, son dos secciones.

## Movimiento

- Curva única `cubic-bezier(.2, .8, .2, 1)`; 200 ms en botones y enlaces, 500 ms en tarjetas y apariciones.
- Las piezas aparecen subiendo 16 px con opacidad de 0 a 1, una vez, al entrar en pantalla. Las piezas de cristal del hero pueden flotar ±6 px en bucle lento.
- Nada rebota, gira ni parpadea. Respeta `prefers-reduced-motion`.

## Logo

Archivos en `assets/Logos/`.

- `logo-web-y-punto.svg` sobre `fondo` claro; `logo-web-y-punto-sobre-negro.svg` sobre negro.
- `isotipo-azul.svg` (la W con el punto) para favicon, avatar y espacios pequeños; `isotipo-negro.svg` e `isotipo-blanco.svg` cuando el azul no puede usarse (una tinta).
- Zona de respeto: el diámetro del punto por cada lado. Altura mínima: 24 px el logo, 16 px el isotipo.
- No lo recolorees, no le pongas sombra ni contorno, no lo coloques sobre un halo o una foto sin un fondo liso detrás.

## Punto, la mascota

Archivos en `assets/Punto/`. Componente `.wp-punto`.

Punto es un acento, como el azul: aparece poco y siempre para señalar algo.

- **Como mucho una vez por sección y tres por página.** Nunca en el nav ni en el pie.
- **Siempre señala o acompaña a un elemento concreto**: un CTA, una cifra, una nota. Si no hay nada que señalar, no aparece.
- **Pequeño**: 64–128 px de ancho. No es la ilustración del hero.
- **Sin recursos de cómic**: sin bocadillos, sin líneas de movimiento, sin interrogaciones ni bombillas flotando. Si tiene algo que decir, va en una nota de cristal (`.wp-punto__nota`) a su lado.
- **Posado sobre algo**: asomado al borde de una tarjeta (`.wp-punto--asomado`) o de pie junto a un botón, mirando hacia lo que señala. Usa `.wp-punto--espejo` para girarlo.
- Poses: `punto-senala-cta.png` junto a un CTA; `punto-idea.png` junto a una nota o consejo; `punto-saludo.png` en el primer contacto (formulario, auditoría); `punto-celebra.png` solo en confirmaciones («Plaza reservada»); `punto-neutro.png`, `punto-guino.png`, `punto-pensando.png`, `punto-duda.png` y `punto-sorpresa.png` para estados y preguntas frecuentes.
- Es decorativo: `alt=""`. El mensaje siempre está también en texto.

## Imágenes

- Capturas de webs reales dentro de un marco `radio-xl` sobre `fondo-hundido`, con `elev-2`. Nunca maquetas de dispositivos genéricas.
- Fotos de personas (equipo, clientes) en blanco y negro o con color natural sin filtros; nunca teñidas de azul.
- Sobre negro, los objetos se iluminan desde abajo con un halo, como una foto de producto.

## Iconografía

La marca no tiene un juego de iconos propio. Usa flechas tipográficas (`→`) en enlaces y, si hace falta un icono, trazo de 1,5 px en `tinta` o `azul-texto`, sin relleno, a 20–24 px. No uses emojis como iconos.
