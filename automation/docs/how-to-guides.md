# Guías Prácticas (How-To Guides)

Esta sección contiene ejemplos prácticos paso a paso para resolver problemas o realizar tareas específicas con la API.

> [!TIP]
> **Sobre el tiempo programado (`scheduled_time`)**
> * **Opcional:** Si no envías `scheduled_time`, la publicación se realizará de forma **inmediata** (o quedará en borrador/privada dependiendo de la plataforma).
> * **Formato:** Si decides programar, debes enviar el tiempo en formato **UNIX Timestamp** (en segundos). La fecha programada debe estar en el futuro según las restricciones de cada plataforma (por ejemplo, Facebook requiere entre 10 minutos y 75 días).

---

## 1. Publicar en Facebook

La API recibe las peticiones mediante el formato `multipart/form-data`.

### Cómo publicar o programar texto simple

Solo necesitas enviar el mensaje y definir el tipo como `text`.

**Publicación inmediata:**
```bash
curl -X POST http://localhost:3000/api/facebook/schedule \
  -F "message=¡Hola mundo! Esta es mi publicación inmediata" \
  -F "type=text"
```

**Publicación programada:**
```bash
curl -X POST http://localhost:3000/api/facebook/schedule \
  -F "message=¡Hola mundo! Esta es mi publicación programada" \
  -F "type=text" \
  -F "scheduled_time=1718000000"
```

### Cómo publicar o programar una imagen

Asegúrate de cambiar el `type` a `image` y enviar el archivo en el campo `media`.

```bash
curl -X POST http://localhost:3000/api/facebook/schedule \
  -F "message=Miren esta increíble foto." \
  -F "type=image" \
  -F "media=@/ruta/absoluta/a/tu/imagen.jpg"
```

### Cómo publicar o programar un Reel (Video)

Los videos se publican automáticamente como **Facebook Reels**. Cambia el `type` a `video` y proporciona el archivo en `media`.
*(Nota: Actualmente el endpoint recibe el campo `thumbnail` para Facebook, pero es ignorado durante el procesamiento)*.

```bash
curl -X POST http://localhost:3000/api/facebook/schedule \
  -F "message=¡Nuevo Reel disponible!" \
  -F "type=video" \
  -F "scheduled_time=1718000000" \
  -F "media=@/ruta/absoluta/a/tu/video.mp4"
```

---

## 2. Publicar en YouTube

La API soporta subir videos a YouTube y establecer su estado de privacidad.

### Cómo subir un video a YouTube

```bash
curl -X POST http://localhost:3000/api/youtube/schedule \
  -F "title=Mi primer video en YouTube" \
  -F "description=Esta es la descripción del video." \
  -F "privacy_status=unlisted" \
  -F "media=@/ruta/absoluta/a/tu/video.mp4"
```

---

## 3. Automatización en Lote (Batch)

### Cómo programar múltiples videos en lote (`schedule-batch.js`)

El proyecto incluye un script local (`schedule-batch.js`) para programar hasta 5 videos de una sola vez para Facebook, distribuyéndolos a lo largo del día de mañana.

1. Coloca tus archivos de video (`.mp4`) en una carpeta llamada `output` en la raíz del proyecto.
2. Ejecuta el script:
   ```bash
   node schedule-batch.js
   ```
El script leerá los videos y calculará intervalos uniformes entre las **08:00 y las 22:00 del día de mañana** (hora de Chile/GMT-4).

---

## 4. Desarrollo: Cómo agregar un nuevo endpoint validado

El proyecto utiliza **Zod** para la validación de esquemas. Si necesitas crear un nuevo endpoint, sigue estos pasos:

1. **Crear el validador (en `src/validators/`):**
   Define tu esquema usando `z.object`.
   ```javascript
   const { z } = require('zod');
   
   const miNuevoEsquema = z.object({
     campo_requerido: z.string().min(1, 'El campo es requerido')
   });
   
   module.exports = { miNuevoEsquema };
   ```

2. **Aplicar el middleware en la ruta (en `src/routes/`):**
   Importa `validateSchema` y tu esquema, y pásalos como middleware antes del controlador.
   ```javascript
   const { validateSchema } = require('../middlewares/validate.middleware');
   const { miNuevoEsquema } = require('../validators/mi_nuevo.validator');
   
   router.post('/mi-endpoint', validateSchema(miNuevoEsquema), miControlador.funcion);
   ```
