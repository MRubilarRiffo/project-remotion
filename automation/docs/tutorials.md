# Tutorial: Primeros Pasos

Sigue estos pasos rápidos para tener la API funcionando en tu computadora en menos de 5 minutos. Este documento está diseñado para ayudarte a instalar y configurar el proyecto desde cero.

## Requisitos Previos

* **Node.js**: Asegúrate de tener Node.js instalado en tu sistema.
* **Cuenta de Facebook**: Necesitas un `Page ID` y un `Page Access Token` con los permisos necesarios para publicar en tu página.
* **Cuenta de YouTube (Opcional)**: Si planeas subir videos a YouTube, necesitarás configurar las credenciales de OAuth 2.0.

## Instalación

1. **Clona o descarga este proyecto** en tu computadora.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias necesarias ejecutando:

```bash
npm install
```

## Configuración Inicial

La API necesita conectarse a tus cuentas de redes sociales. Para ello, utiliza un archivo de configuración secreto:

1. En la raíz del proyecto, copia el archivo `.env.example` y renómbralo a `.env`.
2. Abre el nuevo archivo `.env` y completa tus datos:

```env
PORT=3000
FACEBOOK_PAGE_ID=aqui_tu_page_id
FACEBOOK_ACCESS_TOKEN=aqui_tu_token_de_acceso

# Si vas a usar YouTube:
# Configura tus variables de entorno para OAuth aquí (según aplique).
```

## Ejecutar la API

Con todo configurado, enciende el servidor ejecutando:

```bash
npm start
```

Verás un mensaje indicando que el servidor se está ejecutando (por defecto en `http://localhost:3000`). ¡La API ya está lista para recibir tus instrucciones!

## Siguientes Pasos

Ahora que tienes la API funcionando, dirígete a las [Guías Prácticas (How-To Guides)](how-to-guides.md) para aprender a realizar tu primera publicación.
