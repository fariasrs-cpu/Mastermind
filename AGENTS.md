
# AGENTS.md

## Propósito del repo
Juego Mastermind (2 jugadores) en la web, con lógica separada de la UI y tests con Jest.

## Convenciones
- JS “vanilla”, sin frameworks.
- Lógica pura en `src/logic.js`. La UI en `src/app.js`.
- Tests en `tests/*.test.js`. Usar casos con y sin dígitos repetidos para robustez.
- Pull Requests deben pasar CI (Jest) antes de fusionarse.

## Definiciones clave
- exact: dígito correcto y en la posición correcta.
- partial: dígito existe en el secreto pero en otra posición.

## Estándares de calidad
- Comentarios JSDoc en `logic.js`.
- Funciones puras, sin efectos secundarios.
- Accesibilidad básica (ARIA) y responsive.
