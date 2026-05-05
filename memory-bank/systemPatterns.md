# System Patterns

## Arquitectura Obligatoria
El proyecto sigue una separación estricta de responsabilidades entre la lógica del programa y la interfaz de usuario.

### `components.js`
- Contiene **únicamente funciones puras**.
- Recibe datos y retorna cadenas de texto con código HTML.
- No contiene lógica de estado ni manipulación directa del DOM (no usa `document.getElementById` ni eventos directos).

### `app.js`
- Maneja toda la lógica del juego (Modelo y Controlador).
- Inyecta el HTML devuelto por `components.js` en el DOM real.
- Gestiona eventos (click listeners usando delegación si es necesario), llamadas asíncronas (`fetch`) y temporizadores.

### Interfaz y CSS
- Se mantiene un diseño responsivo, glassmorphism y temático de hacking.
- Se dibuja un mapa topológico conectando los nodos a través de líneas dibujadas dinámicamente con JS (View in `app.js`).

## Lecciones Aprendidas y Prevención de Bugs (Histórico)
A lo largo del desarrollo (según el historial de prompts), se han resuelto varios problemas críticos que deben evitarse en futuros cambios:
1. **Desplazamiento UI a la izquierda en recargas**: Hubo un bug recurrente donde la ventana de inicio se desplazaba fuera de la pantalla. La estructura flex/grid actual y los contenedores relativos previenen esto. ¡No usar `position: absolute` global para centrar pantallas de forma insegura!
2. **Recorte superior del Mapa Topológico**: La pantalla del mapa sufría un problema donde se cortaba por la parte superior. La solución actual (renderizado en orden inverso en el DOM de nivel 10 a nivel 1, combinado con `column-reverse` o scroll bottom-up y `.scrollTo()`) es crítica y **no debe modificarse**.
3. **Minijuegos Deprecados (SIMON)**: Se intentó implementar un minijuego tipo Simon Says, pero causaba bloqueos y problemas de flujo. Se decidió descartar y centrarse exclusivamente en eventos de **Trivia, Objeto y Refugio**.
4. **Arquitectura MVC previa**: El paso a `app.js` y `components.js` es la evolución de una estructuración Modelo-Vista-Controlador que se aplicó previamente. `app.js` absorbió el Controller y el Model, mientras que la generación de DOM de View se separó a `components.js`.
