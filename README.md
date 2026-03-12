# Mastermind - 2 Jugadores

Juego de Mastermind clásico para dos jugadores, desarrollado con Vanilla JavaScript.

## Reglas del Juego

- **Objetivo:** Adivinar el código secreto de 6 dígitos (0–9).
- **Jugadores:** Dos jugadores, turnos alternos (pass-and-play).
- **Intentos:** 10 intentos por jugador.
- **Feedback:** Por cada intento se recibe:
  - **Exactos (bola verde):** Dígito correcto en la posición correcta.
  - **Parciales (bola roja):** Dígito correcto en una posición incorrecta.
- **Victoria:**
  - Gana quien acierte el código con menos intentos.
  - Si ambos aciertan en el mismo número de intentos, es un empate.
  - Si nadie acierta, gana quien tenga más aciertos "exactos" en su mejor intento. Si empatan en exactos, se miran los "parciales".

## Modos de Juego

1. **Automático (App):** La aplicación genera un código aleatorio.
2. **Manual:** El Jugador 1 define el código secreto que ambos intentarán adivinar.

## Requisitos de Desarrollo

- Node.js (para ejecutar tests)
- Navegador web moderno

## Cómo ejecutar el proyecto

1. Clona el repositorio.
2. Abre `src/index.html` directamente en tu navegador.
3. Opcionalmente, puedes usar un servidor local:
   ```bash
   npm start
   ```

## Cómo ejecutar los tests

Los tests están escritos con Jest y simulan el entorno del navegador con jsdom.

```bash
npm install
npm test
```

## Despliegue en GitHub Pages

1. Sube el código a un repositorio de GitHub.
2. Ve a **Settings > Pages**.
3. En **Build and deployment > Source**, selecciona "Deploy from a branch".
4. Selecciona la rama `main` (o `master`) y la carpeta `/src`.
5. Haz clic en **Save**.

## Estructura del Proyecto

- `src/index.html`: Estructura de la aplicación.
- `src/styles.css`: Estilos y diseño responsive.
- `src/app.js`: Controlador de la UI y gestión del estado.
- `src/logic.js`: Lógica pura del juego y validaciones.
- `tests/`: Pruebas unitarias para la lógica del juego.
- `.github/workflows/ci.yml`: Configuración de Integración Continua.
