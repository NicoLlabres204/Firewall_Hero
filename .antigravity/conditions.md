# CONDICIONES

Objetivo: Crear un programa de tests, online o local, con preguntas relacionadas con la asignatura
de sistemas: comandos windows, linux, hardware, redes IP, contenedores…
El desarrollo hay que hacerlo aplicando la metodología profesional Memory Bank.
https://docs.cline.bot/features/memory-bank
El foco es demostrar que sabes dirigir a una IA siguiendo especificaciones técnicas estrictas.

1. Estructura del Proyecto: El Memory Bank
Antes de generar código, debes configurar tu &quot;cerebro de proyecto&quot; en una carpeta llamada
memory-bank/. Estos archivos serán la fuente de verdad para la IA
Ojo!, utiliza una IA para crear los contenidos de los siguientes archivos y para cualquier otra duda
 productContext.md: Define la visión: una autoescuela para aprender hardware.
 systemPatterns.md: Define las reglas técnicas. Obligatorio: Arquitectura donde
components.js solo tiene funciones puras que devuelven HTML y app.js maneja la lógica.
 activeContext.md: Indica en qué parte del test estás trabajando en este momento.
 progress.md: Lista de lo que ya funciona y lo que falta por hacer.

2. Flujo de Trabajo (Paso a Paso)
Para que el trabajo sea válido, debes seguir este orden:
1. Definir: Escribe las especificaciones en tu Memory Bank.
2. Sincronizar: Asegúrate de que activeContext.md refleje tu tarea actual.
3. Prompting: Pide a la IA que genere el componente (ej. una tarjeta de procesador, un
marcador de aciertos).
Importante: El prompt debe citar tus archivos de especificaciones antes de pedir el
código.
4. Documentar: Guarda cada prompt utilizado en un archivo llamado mensajes_prompts.txt.
5. Actualizar: Al terminar una función, actualiza el archivo progress.md.

3. Requisitos Técnicos Obligatorios
 Componentes Modulares: Debes crear al menos 3 componentes distintos (ej. el test, el
resultad, las imáge).nes
 Orquestación: Se debe integrar todos los componentes de forma encapsulada

4. Matriz de Evaluación (Rúbrica)
Indicador Excelente (5 pts)
# Uso de Memory Bank

Los 4 archivos están presentes,
actualizados y guían el desarrollo.


# Calidad del Prompt

El prompt cita el archivo de specs y reglas
antes de generar el código.


# Arquitectura (Rules.md) 
Las funciones son puras, encapsuladas El código no es modular o mezcla lógica con interfaz.

# Registro de Prompts

El archivo mensajes_prompts.txt contiene
todo el historial de instrucciones.


Entregables:
1. Carpeta del proyecto con el código funcional
2. Carpeta memory-bank/ con la documentación viva del proceso.
3. Archivo mensajes_prompts.txt con todos los comandos enviados a la IA.
