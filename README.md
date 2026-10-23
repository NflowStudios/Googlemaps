# FRECUENCIA 84
### un relato de terror de escritorio

Encontraste una computadora de los 90 en el sótano de tu casa nueva. Los archivos del dueño anterior siguen ahí. Y algo más.

**Jugar:** https://nflowstudios.github.io/Googlemaps/

---

## Cómo se juega

- Pulsa el **botón de encendido** del monitor.
- Explora el escritorio de **Órbita '95**: lee documentos, escucha cintas, revisa el correo.
- Deduce **contraseñas cruzando datos** (fechas, nombres, direcciones) que aparecen en los documentos.
- Repara sectores dañados con **REGDISK.EXE**, limpia la RAM con el **Gestor de tareas** e inyecta contra-código con **INYECTOR.EXE**.
- Escucha a **Disquetín**, tu asistente amigable. Al principio.

**Controles:** ratón (doble clic para abrir), teclado para contraseñas y terminal. `ESC` cierra el menú inicio.

**Duración:** 30–50 minutos. 3 finales. Auriculares recomendados. No juegues a solas.

> El juego incluye ajustes de accesibilidad (destellos de pantalla, filtro CRT, volumen) en **Configuración**.

---

## Estructura del proyecto

```
index.html          — capa principal (monitor, escritorio, finales)
css/fonts.css       — VT323 y Press Start 2P embebidas en base64 (sin CDN)
css/style.css       — estética Órbita '95 + filtro CRT + corrupción
js/sprites.js       — íconos pixel-art y frames de Disquetín
js/audio.js         — motor WebAudio: cintas, SFX, voz de la entidad
js/data.js          — sistema de archivos y documentos de Julián Vane
js/data2.js         — cintas (recetas de síntesis + subtítulos), correos, diálogos
js/core.js          — estado, guardado, corrupción, eventos de terror
js/ui.js            — ventanas, escritorio, taskbar, explorador, bloc de notas
js/ui2.js           — reproductor de cintas, correo, terminal, gestor de tareas
js/minigames.js     — REGDISK (nodos), INYECTOR (patrones)
js/disquetin.js     — la mascota: animación, corrupción, diálogo
js/game.js          — arranque BIOS, capítulos, secuencia final, endings
```

Todo el audio es **sintetizado en tiempo real** con WebAudio (ruido marrón, murmullos pasa-banda, drones de 84 Hz). No hay archivos de sonido ni imágenes externas: cada "foto" se dibuja con canvas y cada fuente vive embebida.

## Guardado

El progreso se guarda automáticamente en `localStorage` del navegador. La opción **Borrar partida** está en Configuración.

## Iterar (guía rápida)

- **Textos y lore** → `js/data.js` (documentos) y `js/data2.js` (cintas, correos, diálogos de Disquetín, finales).
- **Sustos y ritmo** → `js/core.js` (eventos ambientales) y `js/game.js` (capítulos).
- **Sonido de las cintas** → `js/data2.js` (`TAPES.recX.render`) usando los bloques de `js/audio.js`.

*Frecuencia 84 — Fase 1. Hecho con HTML, ruido marrón y cariño.*
