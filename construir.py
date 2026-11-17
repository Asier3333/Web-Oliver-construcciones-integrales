"""Reconstruye index.html (la web completa en un solo archivo) a partir de las piezas de esta carpeta.
Uso:  python3 construir.py      → escribe index.html junto a este archivo.
Piezas: fuente/ (páginas, estilos, efectos y traducción al inglés), marca/ (tokens, componentes y tipografía), recursos/ (logos y Punto)."""
import re, base64, os
R = os.path.dirname(os.path.abspath(__file__))
lee = lambda p: open(p, encoding='utf-8').read()
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
def svg_parts(p):
    s = lee(p)
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    paths = re.findall(r'<path fill="([^"]+)" fill-rule="evenodd" transform="([^"]+)" d="([^"]+)"/>', s)
    return vb, paths
lvb, lp = svg_parts(f'{R}/recursos/logos/logo-web-y-punto.svg')
ivb, ip = svg_parts(f'{R}/recursos/logos/isotipo-azul.svg')
sym = (f'<symbol id="logo" viewBox="{lvb}"><path style="fill:var(--azul)" fill-rule="evenodd" transform="{lp[0][1]}" d="{lp[0][2]}"/>'
       f'<path fill="currentColor" fill-rule="evenodd" transform="{lp[1][1]}" d="{lp[1][2]}"/></symbol>\n    '
       f'<symbol id="iso" viewBox="{ivb}"><path style="fill:var(--azul)" fill-rule="evenodd" transform="{ip[0][1]}" d="{ip[0][2]}"/></symbol>')
# Muro del hero de proyectos: 7 columnas de portadas que se repiten para girar sin corte
AZ = [
 '<div class="azulejo c-modular" data-foto="modular-maker-portada"><i>MODULAR MAKER</i><b>La casa de <em>tu vida.</em></b><u></u></div>',
 '<div class="azulejo c-genera" data-foto="genera-energia-portada"><i>GENERA</i><b>Tu propia <em>energía.</em></b><u></u></div>',
 '<div class="azulejo c-reformas" data-foto="reformas-garcia-portada"><i>REFORMAS GARCÍA</i><b>Cocinas y baños, <em>bien hechos.</em></b><u></u></div>',
 '<div class="azulejo azulejo--b c-modular" data-foto="modular-maker-detalle-1"><i>MODULAR MAKER</i><b>Día 1. <em>Día 180.</em></b></div>',
 '<div class="azulejo azulejo--tuyo"><b>Tu web</b><span>Lista en 7 días</span></div>',
 '<div class="azulejo azulejo--b c-genera" data-foto="genera-energia-detalle-1"><i>GENERA</i><b>Calcula <em>tu ahorro.</em></b></div>',
 '<div class="azulejo azulejo--b c-reformas" data-foto="reformas-garcia-detalle-1"><i>REFORMAS GARCÍA</i><b>Antes. <em>Después.</em></b></div>',
]
def muro():
    cols = []
    for c in range(7):
        mitad = '<div class="muro__mitad">' + ''.join(AZ[(c * 3 + k) % len(AZ)] for k in range(7)) + '</div>'
        cols.append(f'      <div class="muro__col"><div class="muro__pista" style="--t:{[96, 78, 112, 86, 104, 74, 92][c]}s">{mitad}{mitad}</div></div>')
    return chr(10).join(cols)
tokens = lee(f'{R}/marca/tokens.css').replace('FONTURL', 'data:font/woff2;base64,' + b64(f'{R}/marca/Geist-Variable.woff2'))
bundle = lee(f'{R}/marca/componentes.css')
bundle = bundle[:bundle.index('/* ── Utilidades de las vistas previas')]
body = lee(f'{R}/fuente/home.html').replace('{{VISTA_OFERTA}}', lee(f'{R}/fuente/oferta.html')).replace('{{VISTA_PROYECTOS}}', lee(f'{R}/fuente/proyectos.html').replace('{{MURO}}', muro())).replace('{{VISTA_EQUIPO}}', lee(f'{R}/fuente/equipo.html')).replace('{{VISTA_CONTACTO}}', lee(f'{R}/fuente/contacto.html')).replace('{{VISTA_LEGAL}}', lee(f'{R}/fuente/legal.html')).replace('{{AVISO}}', lee(f'{R}/fuente/aviso.html'))
CAL = 'https://calendly.com/marcossabel-agency/30min'
WA = 'https://wa.me/34693731980?text=Hola%2C%20vengo%20de%20vuestra%20web%20y%20quiero%20informaci%C3%B3n.'
for k, v in {'CORREO': 'info.webypunto@gmail.com', 'PUNTO_CELEBRA': 'data:image/png;base64,' + b64(f'{R}/recursos/punto/punto-celebra.png'), 'SIMBOLOS_LOGO': sym, 'LOGO_VB': lvb, 'ISO_VB': ivb, 'CALENDLY': CAL, 'WHATSAPP': WA,
             'PUNTO_SENALA': 'data:image/png;base64,' + b64(f'{R}/recursos/punto/punto-senala-cta.png'),
             'PUNTO_SALUDO': 'data:image/png;base64,' + b64(f'{R}/recursos/punto/punto-saludo.png'),
             'PUNTO_IDEA': 'data:image/png;base64,' + b64(f'{R}/recursos/punto/punto-idea.png')}.items():
    body = body.replace('{{' + k + '}}', v)
assert '{{' not in body
html = f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Home de Web y Punto</title>
<meta name="description" content="Diseño web a medida para PYMES. Tu página profesional, lista en 7 días y con todo el proceso a la vista.">
<meta name="theme-color" content="#000000">
<style>
/* Web y Punto — tokens del sistema de marca. Blanco 60 %, negro 30 %, azul 10 %; una familia tipográfica (Geist). */
{tokens}
{bundle}
{lee(f'{R}/fuente/home.css')}
{lee(f'{R}/fuente/menu.css')}
{lee(f'{R}/fuente/oferta.css')}
{lee(f'{R}/fuente/contacto.css')}
{lee(f'{R}/fuente/proyectos.css')}
{lee(f'{R}/fuente/equipo.css')}
{lee(f'{R}/fuente/formulario.css')}
{lee(f'{R}/fuente/pie.css')}
{lee(f'{R}/fuente/idioma.css')}
</style>
</head>
<body>
{body}
<script>
{lee(f'{R}/fuente/i18n.js').replace('/*DICCIONARIO*/{}', lee(f'{R}/fuente/en.json').replace(chr(10), ''))}
{lee(f'{R}/fuente/comun.js')}
{lee(f'{R}/fuente/home.js')}
{lee(f'{R}/fuente/oferta.js')}
{lee(f'{R}/fuente/contacto.js')}
{lee(f'{R}/fuente/proyectos.js')}
{lee(f'{R}/fuente/equipo.js')}
{lee(f'{R}/fuente/formulario.js')}
{lee(f'{R}/fuente/pie.js')}
WYP.arranca();
</script>
</body>
</html>
'''
open(f'{R}/index.html', 'w', encoding='utf-8').write(html); print('index.html', len(html)//1024, 'KB')
