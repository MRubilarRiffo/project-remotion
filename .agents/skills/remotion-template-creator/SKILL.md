---
name: remotion-template-creator
description: Guía experta para que la IA cree nuevos templates de video en Remotion para este proyecto. Úsala cuando el usuario pida "crear un nuevo template", "hacer un nuevo formato de video", o "agregar un quiz de tipo X".
metadata:
  tags: remotion, templates, video, automation, pipeline
---

# 🎬 Creador de Templates Remotion (Guía Experta)

Esta skill te proporciona el conocimiento de dominio específico necesario para crear, estructurar e integrar exitosamente nuevos templates de video en este proyecto de automatización con Remotion.

## 🏗️ Arquitectura de un Template

Cada nuevo template debe vivir en su propio directorio dentro de `src/templates/`. La estructura estándar es:

```text
src/templates/<nombre-del-template>/
├── <NombreTemplate>Video.jsx      # Componente de composición principal
├── components/                    # Sub-componentes (Timer, Background, Opciones, etc.)
│   ├── ComponenteA.jsx
│   └── ComponenteB.jsx
└── data/
    └── <nombre-datos>.json        # Array de objetos con 10+ ejemplos del contenido
```

Los recursos públicos (imágenes estáticas, audios específicos locales) van en:
`public/templates/<nombre-del-template>/`

## 📜 Reglas de Oro de Animación (¡CRÍTICO!)

Remotion renderiza cada frame de manera aislada (usando Puppeteer/Chromium) y captura screenshots. Por lo tanto:

1.  **PROHIBIDO usar transiciones o animaciones CSS (`transition`, `animation`, `@keyframes`).** Fallarán o se verán entrecortadas en el render final.
2.  **TODO debe animarse con funciones de Remotion:**
    *   Usa `const frame = useCurrentFrame();` para obtener el frame actual.
    *   Usa `interpolate(frame, [in, out], [val1, val2])` para desvanecimientos, movimientos lineales, etc.
    *   Usa `spring({ frame, fps, config: { damping, mass, stiffness } })` para rebotes y animaciones orgánicas (scale-in, pop-ups).
3.  **Determinismo:** Si necesitas valores aleatorios (como posiciones de partículas o estrellas), NO uses `Math.random()`. Debes crear un generador pseudo-aleatorio basado en una semilla (como Mulberry32) o basar el cálculo en el índice/frame.

## 🧬 Anatomía del Componente Principal (`<NombreTemplate>Video.jsx`)

1.  Envuelve todo en un `<AbsoluteFill>` para ocupar el 100% de la pantalla (generalmente 1080x1920, 9:16 vertical).
2.  Usa `<Sequence from={FRAME_INICIO} durationInFrames={DURACION}>` para montar y desmontar elementos en el tiempo.
3.  Recibe las propiedades (props) que vienen del archivo JSON.

### Estructura típica de 3 Actos para Shorts/Reels:
*   **Acto 1: Hook (0-3s)** - Título dramático, pregunta gancho, SFX de entrada (`swoosh.wav`).
*   **Acto 2: Desarrollo (3-10s)** - El contenido principal, visualización de opciones, barra de temporizador, SFX de reloj (`tick.wav`).
*   **Acto 3: Revelación (10-15s)** - Respuesta destacada (animación de spring con overshoot), dato curioso (fun fact), Call to Action (CTA) y SFX de éxito/error (`correct.wav` / `buzzer.wav`).

## 🔊 Efectos de Sonido (SFX)

Prioriza usar la CDN nativa de Remotion para sonidos comunes para no inflar el repositorio:
*   `<Audio src="https://remotion.media/whoosh.wav" />` (o `switch.wav`, `ding.wav`, `vine-boom.wav`).

Para colocar el sonido, envuélvelo en un Sequence (si no, suena en el frame 0):
```jsx
<Sequence from={90} durationInFrames={30} layout="none">
  <Audio src="https://remotion.media/ding.wav" volume={0.7} />
</Sequence>
```
Nota: `layout="none"` evita que el `<Sequence>` interfiera con el flexbox de componentes padre.

## 🔌 Integración en el Pipeline (Paso a Paso)

Una vez construido el template y su JSON, debes conectarlo al sistema. Siempre haz estas dos modificaciones:

### 1. Registrar en `src/Root.jsx`
Importa tu componente principal y agrega una nueva `<Composition>` dentro de `RemotionRoot`.
Asegúrate de definir `defaultProps` con datos válidos para que Remotion Studio no falle al cargar.

```jsx
import { MiNuevoTemplateVideo } from "./templates/mi-nuevo-template/MiNuevoTemplateVideo";

// Dentro de RemotionRoot:
<Composition
  id="MiNuevoTemplateVideo"
  component={MiNuevoTemplateVideo}
  durationInFrames={450} // 15s @ 30fps
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    prop1: "Valor",
    prop2: "Valor",
  }}
/>
```

### 2. Configurar en `render-pipeline.js`
Este script lee los JSON y manda a renderizar usando FFmpeg.
Añade una entrada al arreglo `DATA_SOURCES` (al principio del archivo).
Comenta la línea por defecto, pero déjala lista.

```javascript
const DATA_SOURCES = [
  // ... otros templates
  // { file: "./src/templates/mi-nuevo-template/data/datos.json", category: "mi_categoria", compId: "MiNuevoTemplateVideo" },
];
```

Luego baja a la variable `inputProps` (línea ~80) y asegúrate de mapear cualquier propiedad nueva específica de tu JSON para que el pipeline se la pase al componente.

```javascript
const inputProps = {
  // ... props genéricas
  miPropiedadNueva: q.miPropiedadNueva, // Propiedad específica de mi nuevo template
};
```

## 🧪 Testing y Verificación
Si creaste el template, siempre instruye al usuario a probarlo levantando el servidor de desarrollo local de Remotion:
`npm start` o `npx remotion studio src/Root.jsx`
Y una vez validado, que puede renderizar en lote usando `npm run render-all`.
