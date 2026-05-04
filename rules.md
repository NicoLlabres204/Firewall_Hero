# Guía de Inicio

## 1. Directivas Generales

1. **Documentación Obligatoria**: Cada nuevo proyecto web debe comenzar con la creación de un archivo `index.html`. Este archivo servirá como punto de partida y estructura base.
2. **Integración de Herramientas**: Es obligatorio el uso conjunto de CSS y JavaScript para el desarrollo.
3. **Estructura Modular**: Todos los elementos del proyecto deben organizarse de manera modular,separando claramente el HTML, CSS y JavaScript en archivos independientes.

## 2. Concepto del proyecto:

Se trata de un cave crawler en vista cenital con estética minimalista, en el que controlas a un bit que navega entre directorios y carpetas, resolviendo puzles y desafíos relacionados con la informática y el mundo digital. El objetivo es completar un máximo de 10 pantallas o niveles en total, antes de abandonar el lugar.
Para tomar las mejores decisiones, el jugador tendrá acceso a un mapa similar al de "Inscryption", para decidir si prefiere acceder a una determinada pantalla u otra dependiendo del contenido de cada una.

Cada pantalla tendrá uno de los siguientes mecanismos:
- TRIVIA: Se resuelve una pregunta de A, B, C y D relacionada con el mundo de la informática durante un tiempo límite.
- OBJETO: Se le otorgará al jugador un objeto que le permita reducir las posibilidades de perder en las pruebas.
- REFUGIO: Podrá descansar y conseguir una oportunidad más.
- MINI-JUEGO: Podrá jugar a un mini-juego que le permita ganar dos oportunidades más (o un objeto de mejor calidad).

## 3. Apartado visual:

El juego se mostrará como si fuera un documento de google sheets (De tal manera que en móvil sea perfectamente adaptable). El fondo de los lados será de color negro y la sección central (La que simula ser una hoja) será de color verde digital. La estructura visual se distribuye en cuadrados simulando ser carpetas de escritorio y su contenido variará dependiendo de la casilla en la que se encuentre.
Nada más abrir la aplicación, el jugador se encontrará en el menú principal, que simulará ser la página de inicio del explorador. Aquí podremos pulsar entrar para iniciar el juego. Seguidamente, se mostrará el inicio del mapa y un punto representando al jugador. Éste podrá elegir qué camino podrá tomar (De nuevo, del mismo estilo que el juego "Inscryption"). Cuando un jugador entre en una casilla, se abrirá una ventana que mostrará el contenido de esa casilla (Ya sea un trivia, un objeto, un refugio o un mini-juego). Una vez se resuelva, se cerrará y volverá a la pantalla del mapa, donde el jugador podrá seguir avanzando a la bifurcación o camino siguiente.

## 4. Oportunidades y vidas:

Los jugadores empiezan con 3 oportunidades. En caso de llegar a cero, el jugador deberá comenzar de nuevo.