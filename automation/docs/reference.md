# Referencia Técnica (Reference)

Este documento describe la interfaz técnica, los endpoints disponibles y los mecanismos de respuesta de la API.

---

## 1. Endpoints de la API

### Facebook: Programar Publicación
> **`POST`** `/api/facebook/schedule`

**Content-Type:** `multipart/form-data`

#### Body de la Petición
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `type` | String | **Sí** | Tipo de contenido. Valores permitidos: `text`, `image`, `video`. |
| `message` | String | **Sí** | El texto o descripción de la publicación. Mínimo 1 carácter. |
| `scheduled_time` | String | No | UNIX Timestamp (en segundos). |
| `media` | File | **Depende** | Requerido si `type` es `image` o `video`. |
| `thumbnail` | File | No | Se recibe en el endpoint pero actualmente se descarta al procesar Reels. |

---

### YouTube: Subir Video
> **`POST`** `/api/youtube/schedule`

**Content-Type:** `multipart/form-data`

#### Body de la Petición
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | String | **Sí** | Título del video (1 a 100 caracteres). |
| `description` | String | No | Descripción del video en YouTube. |
| `privacy_status` | Enum | No | `public`, `private` o `unlisted`. Por defecto es `private`. |
| `scheduled_time` | String | No | Fecha/hora programada. |
| `media` | File | **Sí** | El archivo de video a subir. Validado en el controlador. |

---

## 2. Sistema de Validación de Errores

El proyecto utiliza un validador central a través de `Zod`. Cuando el body de la petición no cumple con el esquema definido para el endpoint (por ejemplo, falta un título en YouTube o el `type` en Facebook es inválido), la API intercepta la petición automáticamente usando `validate.middleware.js` antes de llegar al controlador y devuelve un error HTTP 400.

**Formato de Respuesta de Error de Validación (400 Bad Request):**
```json
{
  "success": false,
  "error": "Error de validación",
  "details": [
    {
      "field": "title",
      "message": "El título es requerido"
    }
  ]
}
```

## 3. Respuestas de Éxito

**Formato de Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "video_id": "1234567890"
  }
}
```
