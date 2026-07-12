# Explicaciones Conceptuales (Explanation)

Este documento detalla el diseño, arquitectura y decisiones técnicas que hay detrás del funcionamiento de la API, para ayudar a los desarrolladores a comprender el *porqué* de las cosas.

## 1. Arquitectura de Validaciones con Zod

Anteriormente, las validaciones solían estar mezcladas dentro de los controladores, lo que dificultaba la lectura del código principal y propiciaba código duplicado.

Con la reciente refactorización, el proyecto adoptó el uso de **Zod**, una librería de declaración de esquemas. La decisión arquitectónica fue separar las responsabilidades:

1. **Esquemas Aislados:** Las reglas de negocio (ej. "el título no puede exceder 100 caracteres", o "los estados permitidos son public, private, unlisted") viven en la capa de validadores (`src/validators/`). Esto centraliza las reglas.
2. **Middleware Interceptor (`validate.middleware.js`):** En lugar de que cada controlador llame manualmente a Zod, se inyecta el middleware directamente en la definición de la ruta de Express. El middleware llama a `schema.parse(req.body)`. Si falla, la ejecución se detiene y Zod devuelve un array de errores estructurados. El middleware los formatea a un estándar legible (`field` y `message`) y retorna inmediatamente un error 400. 
3. **Controladores Limpios:** Cuando el flujo llega al controlador, el desarrollador tiene la certeza absoluta de que `req.body` cumple con las reglas. 

## 2. Publicación de Videos como Facebook Reels

El servicio de backend de Facebook utiliza la API de Reels (`/video_reels`) en lugar del endpoint de videos tradicionales. Esto es porque el alcance (reach) orgánico de los Reels suele ser mayor en la plataforma actual.

Subir un Reel es un proceso de tres fases resumibles (gestionadas internamente por la API):

1. **Fase de Inicialización (`start`):** Registra una sesión de carga de Reels de video en Facebook y obtiene un `video_id`.
2. **Fase de Carga (`transfer`):** Sube el archivo binario completo del video al servidor de carga rápida de Facebook (`rupload.facebook.com`) mediante `application/octet-stream`. Es la fase que toma más tiempo, dependiendo del tamaño del archivo.
3. **Fase de Finalización (`finish`):** Aplica la descripción/mensaje, el estado (publicado inmediatamente o programado), la hora programada y publica el Reel de forma oficial.

Esta naturaleza asíncrona implica que en la fase de carga pueden surgir errores de red, por lo que los controladores utilizan bloques `try/catch` para interceptarlos y, crucialmente, eliminan el archivo de disco (`fs.unlinkSync()`) para evitar llenar la carpeta `uploads/` de archivos huérfanos si la transferencia falla.
