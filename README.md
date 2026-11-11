# Trabajo 2 — Linealidad e Invariancia Temporal

Presentación interactiva para el curso de **Señales y Sistemas** (Ingeniería de Telecomunicaciones, UNSA), basada en reveal.js. Incluye **14 diapositivas** con teoría, demostraciones algebraicas, gráficas animadas y actividades.

## Cómo abrirla

1. Descomprime el ZIP y abre la carpeta en Visual Studio Code.
2. Abre `index.html` en Chrome o Edge. Usa las flechas izquierda y derecha para navegar.
3. En las diapositivas con gráficas, mueve los controles y cambia entre los sistemas para comparar resultados.

No requiere `npm install`, Python, compilación ni extensiones adicionales. La biblioteca de presentación reveal.js se carga desde un CDN; **MathJax y sus tipografías matemáticas están incluidas localmente**. Si no hay conexión, se activa la navegación de respaldo.

## Archivos

- `index.html` — contenido y fórmulas escritas en sintaxis LaTeX entre `\(...\)` y `\[...\]`.
- `styles.css` — diseño y estilos.
- `script.js` — gráficas Canvas, simulaciones y botones.
- `assets/mathjax/` — motor y fuentes matemáticas sin conexión.
- `.nojekyll` — compatibilidad con GitHub Pages.

## Orden recomendado de exposición

1. Qué es un sistema.
2. Linealidad y principio de superposición.
3. Demostración de un sistema lineal y exploración gráfica.
4. Contraejemplo con un sistema no lineal.
5. Desplazamiento en el tiempo.
6. Definición y comprobación visual de invariancia temporal.
7. Ejemplo algebraico de un sistema variante.
8. Tabla de clasificación de sistemas, pregunta final y conclusiones.

**Nota matemática:** una verificación con ciertas señales no demuestra linealidad o invariancia para todas las entradas; los ejemplos algebraicos sí permiten establecer las propiedades de los sistemas estudiados.

## Publicar en GitHub Pages

1. Crea un repositorio público en GitHub.
2. Sube a la raíz el archivo `index.html`, `styles.css`, `script.js`, `README.md`, `.nojekyll` y **toda** la carpeta `assets`.
3. En `Settings > Pages` activa `Deploy from a branch` → `main` → `/(root)`.
4. Envía al docente el enlace del sitio GitHub Pages y el enlace del repositorio.

## Personalización

- Modifica el título o el texto en `index.html`.
- Las expresiones entre `\(...\)` y `\[...\]` se escriben en formato LaTeX y se muestran con MathJax.
- Los colores, tamaños y fondo se controlan en `styles.css`.
- Las ecuaciones de las gráficas y controles están en `script.js`.
- Antes de publicar, verifica el número del grupo e incorpora los nombres de integrantes si lo consideras necesario.

Referencia: Oppenheim, Willsky y Nawab, *Señales y sistemas*.
