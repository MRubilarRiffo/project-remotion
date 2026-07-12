---
name: social-media-api
description: Instrucciones detalladas para que cualquier IA entienda y utilice la API completa de automatización (Facebook y YouTube) para programar contenido y extraer métricas.
---

# Social Media Automation API - Guía de Uso para IAs

Esta skill proporciona el contexto y las instrucciones necesarias para interactuar con la API local de este proyecto. La API permite automatizar publicaciones (programación) y analizar el rendimiento (métricas) tanto en Facebook como en YouTube.

## Servidor
- **URL Base:** `http://localhost:3000/api`
- **Comando de inicio:** `npm start` (o `node src/server.js`). Asegúrate de que el servidor esté corriendo antes de hacer peticiones.

---

## 1. Módulo de Facebook (`/api/facebook`)

### 1.1 Programar Contenido
- **Endpoint:** `POST /facebook/schedule`
- **Formato:** `multipart/form-data`
- **Parámetros:**
  - `type` (String): Requerido. Tipo de publicación. Valores permitidos: `text`, `image`, `video`.
  - `message` (String): Opcional (obligatorio si `type` es `text`). El texto de la publicación o descripción del reel/imagen.
  - `scheduled_time` (String/Number): Opcional. Timestamp en formato UNIX (segundos) indicando cuándo se debe publicar. Si se omite, se publica inmediatamente.
  - `media` (File): Requerido si `type` es `image` o `video`. El archivo multimedia a subir.
  - `thumbnail` (File): Opcional. Miniatura personalizada para videos/reels.

### 1.2 Analíticas de la Página
- **Endpoint:** `GET /facebook/analytics`
- **Respuesta:** JSON con la información básica de la página.
- **Campos devueltos:** `id`, `name`, `followers_count`, `fan_count` (likes de la página).

### 1.3 Analíticas de Publicaciones (Top Performers)
- **Endpoint:** `GET /facebook/analytics/posts`
- **Parámetros de Query:** `?limit=N` (Opcional, por defecto 25).
- **Comportamiento:** Extrae publicaciones normales y Reels (Video Reels), los combina y los ordena de más reciente a más antiguo.
- **Campos devueltos por post/reel:**
  - `id`: ID único de Facebook.
  - `message`: Texto o descripción.
  - `created_time`: Fecha de subida.
  - `likes`: Cantidad total de Me Gusta.
  - `comments`: Cantidad total de comentarios.
  - `shares`: Cantidad total de compartidos.
  - `views`: Cantidad de reproducciones/vistas (aplica principalmente para Reels bajo la métrica `fb_reels_total_plays`).
  - `type`: `post/image` o `video/reel`.

---

## 2. Módulo de YouTube (`/api/youtube`)

### 2.1 Programar Video
- **Endpoint:** `POST /youtube/schedule`
- **Formato:** `multipart/form-data`
- **Parámetros:**
  - `title` (String): Requerido. El título del video.
  - `description` (String): Opcional. La descripción del video.
  - `privacy_status` (String): Opcional. Valores permitidos: `public`, `private`, `unlisted`. (Por defecto es private si se programa).
  - `scheduled_time` (String/Number): Opcional. Timestamp en formato UNIX (segundos). Obliga a que el estado pase a `private` automáticamente hasta la fecha programada.
  - `media` (File): Requerido. El archivo de video `.mp4`.
  - `thumbnail` (File): Opcional. Imagen de miniatura personalizada para el video.

### 2.2 Analíticas del Canal
- **Endpoint:** `GET /youtube/analytics`
- **Respuesta:** Devuelve métricas globales del canal del usuario autenticado.
- **Campos devueltos:** `channelId`, `title`, `statistics` (vistas totales, suscriptores, total de videos).

### 2.3 Analíticas de Videos Recientes
- **Endpoint:** `GET /youtube/analytics/videos`
- **Parámetros de Query:** `?limit=N` (Opcional, por defecto 50).
- **Comportamiento:** Obtiene los últimos videos subidos de la lista de reproducción "uploads" del canal y extrae sus estadísticas.
- **Campos devueltos por video:**
  - `videoId`: ID de YouTube.
  - `title`: Título del video.
  - `publishedAt`: Fecha de publicación.
  - `statistics`: Objeto que incluye `viewCount` (vistas), `likeCount` (likes), `commentCount` (comentarios).

---

## Mejores Prácticas para IAs

1. **Subida de Publicaciones (Scripting directo vs HTTP):** 
   Aunque puedes usar `curl -F` para interactuar con los endpoints HTTP, la forma **más segura y recomendada** para una IA es crear y ejecutar un script temporal en Node.js (usando tu herramienta de comandos) que importe los servicios directamente. 
   
   Ejemplo de script para subir contenido de forma programática:
   ```javascript
   require('dotenv').config();
   const fs = require('fs');
   const fbService = require('./src/services/facebook.service');
   const ytService = require('./src/services/youtube.service');
   
   async function run() {
     const filePath = './output/video1.mp4';
     const thumbPath = './output/thumbnails/thumb1.png';
     const mediaFile = { path: filePath, size: fs.statSync(filePath).size, mimetype: 'video/mp4' };
     const thumbnailFile = { path: thumbPath };
     const timestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hora en el futuro
     
     // Facebook
     await fbService.scheduleContent({
       message: 'Mi post #Reel', type: 'video', mediaFile, thumbnailFile, scheduledTime: timestamp
     });
     
     // YouTube (¡Recuerda incluir madeForKids!)
     await ytService.uploadVideo({
       title: 'Mi video #Shorts', description: 'Desc', privacyStatus: 'private', 
       scheduledTime: timestamp, mediaFile, thumbnailFile, madeForKids: false
     });
   }
   run();
   ```

2. **Identificar "Top Performers":** Utiliza los servicios directamente (ej: `getPostsAnalytics(50)`) o los endpoints HTTP para leer el campo `views` (Facebook) o `viewCount` (YouTube). Ordena por vistas para identificar las temáticas con más éxito.

3. **Manejo de Errores:** Las llamadas a las funciones de servicio de Facebook y YouTube arrojarán errores si el token expira o es inválido. Siempre envuelve la ejecución en un bloque `try/catch` para poder informar al usuario de cualquier eventualidad.

4. **Métricas de Retención y Gancho (Hook Rate):** A diferencia de la API nativa de Facebook (que omite los abandonos antes del tercer segundo), nuestra API interna ha sido modificada para deducir matemáticamente y entregar la retención **real**. 
   - Al consultar `getPostsAnalytics()`, cada reel incluirá un campo `hook_rate` (porcentaje de usuarios que llegaron al segundo 3) y un objeto `retention_graph` que ya ha sido ajustado para que el segundo "0" equivalga al 100% de los espectadores iniciales y la curva subsiguiente esté escalada proporcionalmente. 
   - ¡No necesitas hacer cálculos manuales adicionales! Puedes confiar directamente en el `hook_rate` y en el `retention_graph` devueltos por el servicio.
