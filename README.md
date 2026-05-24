# Documentación: Generador de Videos Quiz Educativos con Remotion

Esta guía detalla el funcionamiento interno del generador de videos automatizado. Aquí aprenderás cómo modificar el contenido, agregar nuevas categorías, y alterar la línea de tiempo o el orden de las escenas.

---

## 1. ¿Cómo funciona el proyecto?

El proyecto utiliza **Remotion**, un framework que permite crear videos programáticamente usando React. En lugar de editar en un software tradicional (como Premiere o After Effects), todo el video se describe mediante componentes y fotogramas (frames).

- **Resolución:** 1080x1920 (Vertical, ideal para TikTok, Reels, Shorts).
- **FPS (Fotogramas por Segundo):** 30.
- **Duración Total por Video:** 16 Segundos (480 fotogramas).

Las animaciones (entradas, rebotes, confeti) están construidas matemáticamente usando la función `spring` (resortes físicos) e `interpolate` de Remotion, asegurando que cada frame se renderice de manera perfecta y determinista.

---

## 2. Cómo agregar nuevas preguntas (Países, Animales, etc.)

Los datos que alimentan los videos se encuentran en la carpeta `src/data/`. Para agregar una nueva pregunta a una categoría existente (por ejemplo, agregar "Francia" a los países), simplemente edita el archivo `src/data/countries.json`:

```json
[
  {
    "id": 4,
    "category": "países",
    "title": "🌎 ADIVINA EL PAÍS",
    "answer": "FRANCIA",
    "hint": "F _ A _ C _ A",
    "image": "https://flagcdn.com/w640/fr.png",
    "funFact": "¡La Torre Eiffel se encuentra en su capital, París!"
  }
]
```

**Parámetros:**
- `category`: Identifica la temática. Usado para cambiar el color de fondo.
- `title`: El texto grande que aparece en la primera escena.
- `answer`: La palabra completa que se revelará al final. **Debe coincidir en longitud con `hint`** (sin contar espacios redundantes).
- `hint`: La pista visual. Usa guiones bajos `_` para las letras ocultas y letras normales para las visibles.
- `image` o `flagUrl`: URL de la imagen principal.
- `funFact`: (Opcional) Un dato curioso que aparece como pop-up al final del video.

---

## 3. Cómo crear una nueva Categoría (ej. "Frutas")

Si deseas crear una categoría completamente nueva, sigue estos pasos:

### Paso A: Crear el archivo JSON de datos
Crea un archivo llamado `src/data/fruits.json` con tus preguntas:
```json
[
  {
    "id": 1,
    "category": "frutas",
    "title": "🍎 ADIVINA LA FRUTA",
    "answer": "MANZANA",
    "hint": "M _ N _ A _ A",
    "image": "URL_DE_TU_IMAGEN.png",
    "funFact": "¡Las manzanas flotan en el agua porque un 25% de su volumen es aire!"
  }
]
```

### Paso B: Registrar la categoría en el Pipeline de Renderizado
Abre el archivo `render-pipeline.js` en la raíz del proyecto. Busca la constante `DATA_SOURCES` en la parte superior y agrega tu nuevo archivo:

```javascript
const DATA_SOURCES = [
  { file: "./src/data/countries.json", category: "países" },
  { file: "./src/data/animals.json", category: "animales" },
  { file: "./src/data/fruits.json", category: "frutas" } // <-- ¡Nueva categoría agregada!
];
```

### Paso C: (Opcional) Asignar colores personalizados
Para que la nueva categoría tenga colores únicos de fondo, abre `src/components/Background.jsx` y agrega un nuevo `case` en la función `getGradientStyle()`:

```javascript
  const getGradientStyle = () => {
    switch (colorTheme) {
      case "frutas": // Colores para tu nueva categoría
        return { background: "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)" };
      // ... otros casos
    }
  };
```

---

## 4. Cómo modificar, cambiar o reordenar Escenas

El "director" de nuestro video es el archivo principal de composición: **`src/QuizVideo.jsx`**.
En este archivo verás múltiples componentes `<Sequence>`. Cada `<Sequence>` le dice a Remotion en qué momento debe aparecer una escena y cuánto tiempo debe durar.

```jsx
// Ejemplo en src/QuizVideo.jsx

{/* 3. Escena 1: Intro (Frames 0 - 90) */}
<Sequence from={0} durationInFrames={90}>
  <IntroScene title={title} emoji={emoji} />
</Sequence>

{/* 4. Escenas 2 y 3: Quiz + Temporizador (Frames 90 - 360) */}
<Sequence from={90} durationInFrames={270}>
  <QuizScene flagUrl={flagUrl} hint={hint} answer={answer} categoryTitle={title} />
</Sequence>
```

### Alterar Tiempos (Timing)
La matemática del tiempo es: `1 Segundo = 30 Frames` (porque `fps={30}`).
- **`from`**: Define en qué fotograma exacto comienza a renderizarse la escena.
- **`durationInFrames`**: Define cuántos fotogramas durará visible.

Si quieres que la `IntroScene` dure **4 segundos** en lugar de 3:
1. Cambias la Intro: `<Sequence from={0} durationInFrames={120}>` (4 seg * 30 fps = 120).
2. Debes **desplazar** la escena siguiente para que no se superpongan (a menos que quieras una transición cruzada). Entonces el `QuizScene` pasaría a empezar en el frame 120: `<Sequence from={120} ...>`.
3. Recuerda ajustar la duración total del video en `src/Root.jsx` (`durationInFrames`) para que concuerde con la suma de tus escenas.

### Reordenar o Agregar Escenas
Para agregar una nueva escena (ej. un Outro con tu logo de marca), simplemente crea tu componente `OutroScene.jsx` y añádelo al final del timeline en `src/QuizVideo.jsx`:

```jsx
{/* Escena 5: Mi Logo Outro (Frames 480 - 540) */}
<Sequence from={480} durationInFrames={60}>
  <OutroScene />
</Sequence>
```
*No olvides ir a `src/Root.jsx` e incrementar el `durationInFrames` a `450` para darle tiempo de existir.*

---

## 5. Edición de Textos, Estilos y Animaciones

### Modificar Estilos (Colores, Fuentes, Bordes)
Todos los componentes tienen su archivo `.module.css` asociado (ej. `IntroScene.module.css`). Esto significa que las clases están "encapsuladas" y no romperán el resto de la app. Puedes modificar libremente márgenes, colores o sombras editando el archivo correspondiente.

### Modificar Animaciones (Springs)
Si quieres que las letras salten más alto o más rápido, debes ajustar el comportamiento del `spring()` en el componente React respectivo (por ejemplo, en `src/components/LetterBox.jsx` o `src/scenes/IntroScene.jsx`).

```jsx
const miAnimacion = spring({
  frame,
  fps,
  config: {
    damping: 10,   // "Fricción" (menor = rebota más veces, mayor = se frena en seco)
    mass: 0.5,     // "Peso" (menor = salta súper rápido, mayor = se mueve lento y pesado)
    stiffness: 120 // "Fuerza del resorte" (mayor = el movimiento es más brusco y potente)
  },
});
```
Juega con estos tres valores (`damping`, `mass`, `stiffness`) para obtener rebotes más exagerados o más serios.

---

## 6. Comandos Principales

### Visualización en Tiempo Real
Mientras desarrollas y ajustas los tiempos (`from` y `durationInFrames`), usa el entorno de estudio:
```bash
npm start
```
Esto abrirá una página web donde podrás darle Play a la composición y ver exactamente cómo se alinean los fotogramas y la música.

### Renderizado de Producción
Cuando estés feliz con los resultados, ejecuta el pipeline para convertir tus JSON en videos MP4 finales:
```bash
npm run render-all
```
Los videos aparecerán en la carpeta `/output` en unos segundos, mezclados y comprimidos con FFmpeg y listos para subirse a redes sociales.
