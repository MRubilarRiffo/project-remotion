# Guía para crear Templates y Renderizar Videos en Lote

Esta guía explica cómo cualquier desarrollador o Inteligencia Artificial puede usar este proyecto para crear nuevos templates de Remotion, suministrarles datos a través de un archivo JSON, y generar cientos de videos de manera automatizada.

## Flujo de Trabajo General

El sistema de generación masiva consta de 3 partes:
1. **Template (Remotion):** El componente visual que define cómo se ve el video. Recibe propiedades dinámicas (`inputProps`).
2. **JSON de Datos:** Un archivo que contiene un arreglo con el contenido de cada video (preguntas, títulos, imágenes).
3. **Render Pipeline:** El script (`render-pipeline.js`) que une el JSON con el Template para exportar los archivos `.mp4`.

---

## Paso 1: Crear la Composición (Template) en Remotion

Para que el sistema pueda renderizar videos, primero debes crear el aspecto visual.

1. **Crea tus componentes de React:** Diseña la interfaz visual de tu video en la carpeta `src/`. Todo el contenido dinámico debe ser recibido vía `props`.
2. **Registra la Composición:** Abre el archivo `src/Root.jsx` y añade una nueva `<Composition />`. Debes asignarle un `id` único que usaremos más adelante.

```jsx
// En src/Root.jsx
import { Composition } from "remotion";
import { MiNuevoTemplate } from "./templates/mi-nuevo-template/Main";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MiNuevoTemplateVideo" // <- Este ID es crucial
        component={MiNuevoTemplate}
        durationInFrames={900} // Duración base (ajustable)
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "Template de Prueba",
          category: "general"
        }}
      />
      {/* Otras composiciones... */}
    </>
  );
};
```

---

## Paso 2: Preparar la Fuente de Datos (JSON)

Para generar múltiples videos, debes proporcionar un archivo JSON. Por convención, guárdalo cerca de tu template, por ejemplo en `src/templates/mi-nuevo-template/data/datos.json`.

El archivo debe contener un **arreglo de objetos**, donde cada objeto representa un video a renderizar.

```json
[
  {
    "id": 1,
    "category": "tecnologia",
    "title": "¿Cuál es este lenguaje?",
    "hookText": "¡Adivina el lenguaje de programación!",
    "answer": "JavaScript",
    "image": "https://ejemplo.com/js-logo.png"
  },
  {
    "id": 2,
    "category": "tecnologia",
    "title": "¿Cuál es este lenguaje?",
    "hookText": "¡Adivina el lenguaje!",
    "answer": "Python",
    "image": "https://ejemplo.com/python-logo.png"
  }
]
```

---

## Paso 3: Configurar el Render Pipeline

El corazón de la generación masiva es el archivo `render-pipeline.js`. Debes editarlo para decirle al script dónde está tu JSON y con qué Template (`id` de la composición) debe emparejarlo.

1. Abre `render-pipeline.js`.
2. Busca el arreglo constante `DATA_SOURCES`.
3. Agrega un nuevo objeto con la ruta al JSON, una categoría, y el `compId` exacto que definiste en `src/Root.jsx`.

```javascript
// En render-pipeline.js
const DATA_SOURCES = [
  // Puedes comentar las fuentes anteriores si no quieres re-renderizarlas
  // { file: "./src/templates/math-quiz/data/math.json", category: "matemáticas", compId: "MathQuizVideo" },
  
  // Agrega tu nueva fuente de datos:
  { 
    file: "./src/templates/mi-nuevo-template/data/datos.json", 
    category: "tecnologia", 
    compId: "MiNuevoTemplateVideo" // Debe coincidir con Root.jsx
  }
];
```

---

## Paso 4: Ejecutar la Generación en Lote

Una vez que el Template y el JSON están enlazados en el pipeline, ejecuta la creación masiva desde tu terminal:

```bash
npm run render-all
```

El script hará lo siguiente:
1. Compilará el proyecto de Remotion.
2. Leerá tu archivo JSON.
3. Inyectará las propiedades de cada objeto JSON dentro del Template.
4. Exportará cada video usando FFmpeg acelerado por hardware.

**¿Dónde están los videos?**
Todos los videos generados aparecerán automáticamente dentro de la carpeta `/output` en la raíz del proyecto, nombrados según la composición, la categoría y la respuesta (ej. `MiNuevoTemplateVideo_tecnologia_javascript.mp4`).

---

## Referencia: Propiedades inyectadas por el Pipeline

Actualmente, el archivo `render-pipeline.js` intercepta las llaves de tu JSON y las mapea en un objeto fijo llamado `inputProps`. Si eres una IA creando un nuevo JSON, debes usar las siguientes llaves para que los datos pasen correctamente al componente de Remotion:

| Llave en JSON | Tipo | Uso / Descripción |
| :--- | :--- | :--- |
| `category` | String | Categoría general (ej. "matemáticas"). Fallback: "general". |
| `title` | String | Título principal del video. Fallback: "ADIVINA". |
| `hookText` | String | Texto de gancho al inicio del video. |
| `emoji` | String | Emoji asociado. Fallback: "❓". |
| `answer` | String | La respuesta correcta (también usada en el nombre de archivo). |
| `hint` | String | Texto de pista. |
| `flag` o `image` | String (URL) | URL o ruta de una imagen/bandera a mostrar. |
| `funFact` | String | Un dato curioso. Fallback: `""` (string vacío). |
| `background` | String | Ruta de la imagen/video de fondo. |
| `audioFile` | String | Ruta de un archivo de audio específico (usado en `guess-flag`). |
| `equation` | String | Ecuación para el template matemático. |
| `options` | Array | Opciones a mostrar en un quiz. |
| `answerIndex` | Number | Índice de la opción correcta dentro de `options`. |
| `flags` | Array | Usado para templates que requieren mostrar múltiples banderas en secuencia. |

> [!NOTE]
> Si en el futuro tu template necesita una propiedad completamente nueva (por ejemplo, `userAvatar`), deberás editar el objeto `inputProps` dentro del bucle `for` en `render-pipeline.js` para que el script inyecte esa variable desde el JSON hacia Remotion.
