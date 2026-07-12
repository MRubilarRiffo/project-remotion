# Social Media Automation API

¡Bienvenido! Esta API te permite automatizar de manera sencilla la programación de publicaciones en Facebook y YouTube. Está diseñada para ser muy fácil de usar, permitiéndote enviar textos, imágenes y videos programados para una fecha y hora específicas.

## Documentación

Hemos estructurado la documentación del proyecto utilizando el framework [Diátaxis](https://diataxis.fr/), dividiendo el contenido según tus necesidades específicas:

- **[Tutorials (Primeros Pasos)](docs/tutorials.md):** Comienza aquí. Una guía paso a paso para instalar, configurar y levantar la API en tu entorno local.
- **[How-to Guides (Guías Prácticas)](docs/how-to-guides.md):** Ejemplos prácticos y recetas para usar la API. Aprende cómo publicar texto, imágenes, o videos (Reels) en Facebook, cómo subir videos a YouTube, y cómo usar el script de automatización en lote (`schedule-batch.js`). También incluye una guía para desarrolladores sobre cómo agregar nuevos endpoints.
- **[Reference (Referencia Técnica)](docs/reference.md):** La especificación técnica completa de la API. Aquí encontrarás los endpoints detallados (URLs, body esperado, tipos de datos) y el formato estándar de respuestas de éxito y error (middleware de validación con Zod).
- **[Explanation (Explicaciones Conceptuales)](docs/explanation.md):** Lectura profunda sobre las decisiones arquitectónicas del proyecto, como el flujo de validación centralizado con Zod y el mecanismo de subida de Reels de Facebook en múltiples fases.

---

### Scripts Especiales Incluidos

- `schedule-batch.js`: Script para automatizar la programación múltiple (hasta 5 videos) a lo largo de un día. (Ver las [Guías Prácticas](docs/how-to-guides.md#3-automatización-en-lote-batch) para más detalles).

### Soporte

Si tienes algún problema con las validaciones (por ejemplo, errores 400), asegúrate de consultar la sección del **Sistema de Validación** en la [Referencia de la API](docs/reference.md).
