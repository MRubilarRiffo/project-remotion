require('dotenv').config();
const fs = require('fs');
const path = require('path');
const youtubeService = require('./src/services/youtube.service');

async function scheduleVideo() {
  const videoPath = path.join(__dirname, '../project-remotion/el_perfume_cap1_corregido.mp4');
  const thumbPath = 'C:\\Users\\mrubi\\.gemini\\antigravity\\brain\\91176a52-29e2-450f-952e-ac22f5730bfb\\miniatura_el_perfume_esp_1785734164602.jpg';

  if (!fs.existsSync(videoPath)) {
    console.error('❌ Error: El video renderizado no existe aún en:', videoPath);
    return;
  }
  if (!fs.existsSync(thumbPath)) {
    console.warn('⚠️ Advertencia: No se encontró la miniatura en:', thumbPath);
  }

  const mediaFile = { 
    path: videoPath, 
    size: fs.statSync(videoPath).size, 
    mimetype: 'video/mp4' 
  };
  
  const thumbnailFile = fs.existsSync(thumbPath) ? { path: thumbPath } : undefined;

  // Programar para mañana martes 4 de agosto de 2026 a las 15:00 (hora local del usuario)
  // 15:00 hrs es el mejor horario de publicación los martes para interceptar la audiencia de tarde (4-9 PM)
  const scheduledDate = new Date('2026-08-04T15:00:00-04:00');
  const timestamp = Math.floor(scheduledDate.getTime() / 1000);

  const title = 'El Perfume: Capítulo 1 Resumen Animado (El Nacimiento de Grenouille) 🕯️';
  const description = `En el siglo dieciocho vivió en Francia uno de los hombres más geniales y abominables de su época: Jean-Baptiste Grenouille. Descubre en este resumen visual y sonoro la oscura odisea del mayor asesino y genio del olfato de la literatura gótica. 🕯️🍷

📖 Libro: El Perfume (Das Parfum: Die Geschichte eines Mörders)
✍️ Autor: Patrick Süskind
🎭 Capítulo 1: El nacimiento de Grenouille en la zona más maloliente de París.

⏰ CAPÍTULOS DEL RESUMEN:
00:00 - Introducción al monstruo genial
00:24 - El insoportable hedor de Europa y París en el siglo XVIII
01:21 - El macabro Cimetière des Innocents (Cementerio de los Inocentes)
02:04 - El nacimiento en el mercado de pescado y condena de la madre
03:07 - Las nodrizas desesperadas y el rechazo de la sociedad
03:49 - El bautizo en Saint-Merri y el inicio de la leyenda

🔗 ¡SUSCRÍBETE al canal para no perderte los siguientes capítulos y más resúmenes literarios animados! 👍 Deja tu Like si te gustó la atmósfera gótica.

#ElPerfume #PatrickSuskind #Resumen #Audiolibro #LiteraturaGotica #Libros #BookTube #Historia`;

  console.log('--- PREPARANDO PROGRAMACIÓN PARA YOUTUBE AUTOMATION ---');
  console.log(`🎬 Video: ${videoPath} (${(mediaFile.size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`🖼️ Miniatura: ${thumbPath}`);
  console.log(`📅 Fecha programada: ${scheduledDate.toLocaleString()} (UNIX: ${timestamp}) - Horario pico de tarde`);
  console.log(`🏷️ Título: ${title}`);

  try {
    const result = await youtubeService.uploadVideo({
      title,
      description,
      privacyStatus: 'private', // Obligatorio 'private' en YouTube API para agendar estreno/programación
      scheduledTime: timestamp,
      mediaFile,
      thumbnailFile,
      madeForKids: false
    });

    console.log('✅ ¡VIDEO PROGRAMADO CON ÉXITO EN YOUTUBE!');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error durante la subida y programación en YouTube:', error);
  }
}

scheduleVideo();
