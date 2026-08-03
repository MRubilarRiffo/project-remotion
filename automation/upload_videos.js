require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fbService = require('./src/services/facebook.service');
const ytService = require('./src/services/youtube.service');

async function run() {
  const outputDir = path.resolve('../output/viral-quiz');
  
  const videos = [
    {
      file: 'ViralQuizVideo_acertijo_math_id_7.mp4',
      time: null, // Now
      fbDesc: '🧠 ¿Puedes resolver este acertijo mental? 🤔 ¡Demuestra tu agilidad mental! Comenta tu respuesta antes de que se acabe el tiempo 👇\n\n#acertijo #retomatematico #desafiomental #quiz',
      ytTitle: '🧠 ¿Puedes resolver este acertijo en 5 segundos? #Shorts',
      ytDesc: '🧠 ¿Puedes resolver este acertijo mental? #acertijo #retomatematico #desafiomental #quiz'
    },
    {
      file: 'ViralQuizVideo_astronomía_math_id_9.mp4',
      time: new Date('2026-07-21T12:00:00-04:00').getTime() / 1000,
      fbDesc: '¿Eres un experto en el universo? 🪐🌍 ¡Pon a prueba tu conocimiento! ¿Acertaste? Comenta 👇\n\n🔔 Síguenos para más trivias diarias\n❤️ Dale like si acertaste\n\n#trivia #astronomia #quiz #datoscuriosos',
      ytTitle: 'Reto de Astronomía Rápido 🪐 ¡Adivina la respuesta! #Shorts',
      ytDesc: '¿Eres un experto en el universo? 🪐🌍 ¡Pon a prueba tu conocimiento! #trivia #astronomia #quiz #datoscuriosos'
    },
    {
      file: 'ViralQuizVideo_biología_math_id_10.mp4',
      time: new Date('2026-07-21T20:00:00-04:00').getTime() / 1000,
      fbDesc: 'A ver si prestabas atención en la clase de biología 🧬 ¿Respondiste correctamente? Te leo en los comentarios! 👇\n\n🔔 Síguenos para más trivias\n\n#trivia #biologia #quiz #aprendeentiktok',
      ytTitle: '🧠 ¿Puedes resolver esto en 5 segundos? Reto de Biología #Shorts',
      ytDesc: 'A ver si prestabas atención en la clase de biología 🧬 #trivia #biologia #quiz #aprendeentiktok'
    }
  ];

  for (const v of videos) {
    const filePath = path.join(outputDir, v.file);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    
    console.log(`Processing: ${v.file}`);
    const mediaFile = { path: filePath, size: fs.statSync(filePath).size, mimetype: 'video/mp4' };
    
    try {
      console.log(`Uploading to Facebook: ${v.file}`);
      const fbData = {
        message: v.fbDesc,
        type: 'video',
        mediaFile: mediaFile
      };
      if (v.time) fbData.scheduledTime = v.time;
      await fbService.scheduleContent(fbData);
      console.log(`✅ Uploaded to Facebook`);
      
      console.log(`Uploading to YouTube: ${v.file}`);
      const ytData = {
        title: v.ytTitle,
        description: v.ytDesc,
        mediaFile: mediaFile,
        madeForKids: false
      };
      if (v.time) {
        ytData.scheduledTime = v.time;
        ytData.privacyStatus = 'private';
      } else {
        ytData.privacyStatus = 'public';
      }
      await ytService.uploadVideo(ytData);
      console.log(`✅ Uploaded to YouTube`);

      // Rename file
      const newPath = path.join(outputDir, `subido_${v.file}`);
      fs.renameSync(filePath, newPath);
      console.log(`Renamed to subido_${v.file}`);

    } catch (err) {
      console.error(`Error processing ${v.file}:`, err);
    }
  }
}

run();
