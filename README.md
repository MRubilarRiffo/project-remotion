# Social Media Content Generator & Automation Suite

¡Bienvenido al ecosistema de automatización y creación de contenido para redes sociales! Este repositorio unifica todo lo necesario para diseñar, renderizar de forma masiva y programar contenido (videos, Reels, posts) en plataformas de redes sociales.

El repositorio está estructurado como un **monorepo** con dos componentes principales:

```
├── .agents/               # Reglas y habilidades de Inteligencia Artificial para el proyecto
├── automation/            # API de Automatización (Publicación y programación en FB y YT)
├── project-remotion/      # Suite de Renderizado de Video (Remotion & React templates)
└── output/                # Carpeta de salida para videos renderizados (ignorada en git)
```

---

## 📁 Componentes del Proyecto

### 1. [project-remotion](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/project-remotion) (Generación de Videos en React)
Es el sistema encargado de crear videos animados de forma programática utilizando React y **Remotion**. Permite alimentar plantillas con datos estructurados (archivos JSON) y renderizar decenas de videos listos para subir.

* **Características principales**:
  * Plantillas reutilizables para Quizzes de matemáticas, banderas, curiosidades y formatos virales.
  * Renderizado acelerado por hardware con FFmpeg.
  * Canalización de renderizado en lote a través de [render-pipeline.js](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/project-remotion/render-pipeline.js).
* **Guías Útiles**:
  * [Cómo crear templates y renderizar videos en lote](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/project-remotion/BATCH_RENDERING.md).
* **Cómo empezar**:
  ```bash
  cd project-remotion
  npm install
  npm run dev          # Para abrir la vista previa de Remotion (Studio)
  npm run render-all   # Para renderizar todos los videos configurados en lote
  ```

---

### 2. [automation](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/automation) (API y Scripts de Programación)
Es la API backend desarrollada en Node.js y Express que se conecta con las Graph APIs de Facebook e Instagram, y la API de YouTube para programar y publicar contenido automáticamente.

* **Características principales**:
  * Programación de Reels y posts en Facebook.
  * Carga y optimización de videos en YouTube.
  * Validación estricta de payloads con Zod.
  * Automatización de lotes mediante scripts de control diario (`schedule_facebook_videos.js`, `schedule_yt_videos.js`, etc.).
* **Guías Útiles**:
  * [Tutoriales de Primeros Pasos en la API](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/automation/docs/tutorials.md)
  * [Ejemplos de Programación y Lotes (How-to)](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/automation/docs/how-to-guides.md)
  * [Documentación de Referencia de Endpoints](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/automation/docs/reference.md)
* **Cómo empezar**:
  ```bash
  cd automation
  npm install
  # Configura las variables de entorno en el archivo .env (usa .env.example como plantilla)
  npm start            # Inicia el servidor local de la API
  ```

---

## 🛠️ Flujo de Trabajo Recomendado

1. **Creación**: Diseña un nuevo template visual en la carpeta `project-remotion` o actualiza los datos en los archivos JSON correspondientes.
2. **Generación**: Ejecuta `npm run render-all` dentro de `project-remotion`. Los videos se exportarán a la carpeta raíz `/output/`.
3. **Automatización**: Usa los scripts en `automation` para tomar los videos generados en `/output/` y programar su publicación periódica en tus canales de redes sociales.

---

## ⚙️ Control de Versiones e Integración de Git
Este repositorio está unificado en la raíz. Para evitar subir archivos no deseados (dependencias, configuraciones locales o videos de salida muy pesados), asegúrate de que el [archivo .gitignore raíz](file:///c:/Users/mrubi/OneDrive/Escritorio/Proyectos/social-media/.gitignore) esté siempre actualizado.
