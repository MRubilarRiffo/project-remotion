require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fbService = require('./src/services/facebook.service');
const ytService = require('./src/services/youtube.service');

async function run() {
  const outputDir = path.resolve('../output/viral-quiz');
  
  const videos = [
    {
      file: 'ViralQuizVideo_física_math_id_5.mp4',
      time: new Date('2026-07-22T12:00:00-04:00').getTime() / 1000,
      fbDesc: '¿Recuerdas tus clases de Física? 🍎 ¡Pon a prueba tu conocimiento! ¿Acertaste? Comenta 👇\n\n🔔 Síguenos para más trivias diarias\n\n#trivia #fisica #quiz #datoscuriosos',
      ytTitle: '🧠 ¿Puedes resolver esto en 5 segundos? Reto de Física #Shorts',
      ytDesc: '¿Recuerdas tus clases de Física? 🍎 ¡Pon a prueba tu conocimiento! #trivia #fisica #quiz #datoscuriosos'
    },
    {
      file: 'ViralQuizVideo_geografía_math_id_8.mp4',
      time: new Date('2026-07-22T20:00:00-04:00').getTime() / 1000,
      fbDesc: '¿Te crees un experto en geografía? 🌍 ¡Ponte a prueba! Te reto a adivinar. 🧐🚩\n\nDéjame en los comentarios tu respuesta 👇\n\n#trivia #geografia #quiz #retodeldia',
      ytTitle: 'Reto de Geografía Rápido 🌍 ¡Adivina la respuesta! #Shorts',
      ytDesc: '¿Te crees un experto en geografía? 🌍 ¡Ponte a prueba! #trivia #geografia #quiz #retodeldia'
    },
    {
      file: 'ViralQuizVideo_historia_math_id_3.mp4',
      time: new Date('2026-07-23T12:00:00-04:00').getTime() / 1000,
      fbDesc: '¿Cuánto sabes de historia universal? 📜 ¡Demuestra tu conocimiento! Comenta tu respuesta antes de que acabe el tiempo 👇\n\n#historia #trivia #quiz #sabiasque',
      ytTitle: 'Reto de Historia Rápido ⏳ ¡Adivina la respuesta! #Shorts',
      ytDesc: '¿Cuánto sabes de historia universal? 📜 ¡Demuestra tu conocimiento! #historia #trivia #quiz #sabiasque'
    },
    {
      file: 'ViralQuizVideo_lógica_math_id_2.mp4',
      time: new Date('2026-07-23T20:00:00-04:00').getTime() / 1000,
      fbDesc: '🧠 ¿Puedes resolver este reto de lógica? 🤔 ¡Demuestra tu agilidad mental! Comenta tu respuesta ⬇️\n\n#retomatematico #logica #acertijo #desafiomental',
      ytTitle: '🧠 ¿Puedes resolver este acertijo de lógica? #Shorts',
      ytDesc: '🧠 ¿Puedes resolver este reto de lógica? 🤔 #retomatematico #logica #acertijo #desafiomental'
    },
    {
      file: 'ViralQuizVideo_lógica_math_id_4.mp4',
      time: new Date('2026-07-24T12:00:00-04:00').getTime() / 1000,
      fbDesc: 'A ver si es cierto que tienes buena lógica 🧐 ¿Cuál es tu respuesta? Te leo en los comentarios!\n\n#logica #acertijo #aprendeentiktok #desafiomental',
      ytTitle: 'Reto de Lógica Rápido 🧠 ¡Adivina la respuesta! #Shorts',
      ytDesc: 'A ver si es cierto que tienes buena lógica 🧐 #logica #acertijo #aprendeentiktok #desafiomental'
    },
    {
      file: 'ViralQuizVideo_lógica_math_id_6.mp4',
      time: new Date('2026-07-24T20:00:00-04:00').getTime() / 1000,
      fbDesc: '¡Desafía tu mente con este rápido reto de lógica! 🧠💡 ¿Pudiste resolverlo? Deja tu respuesta abajo 👇\n\n#trivia #logica #acertijo #quiz',
      ytTitle: '🧠 ¿Puedes resolver esto en 5 segundos? Reto de Lógica #Shorts',
      ytDesc: '¡Desafía tu mente con este rápido reto de lógica! 🧠💡 #trivia #logica #acertijo #quiz'
    },
    {
      file: 'ViralQuizVideo_matemáticas_math_id_1.mp4',
      time: new Date('2026-07-25T12:00:00-04:00').getTime() / 1000,
      fbDesc: '🧠 ¿Puedes resolver este reto matemático? 🤔 ¡Demuestra tu agilidad mental! Comenta tu respuesta antes de que se acabe el tiempo ⬇️\n\n#retomatematico #matematicas #acertijo #desafiomental',
      ytTitle: 'Reto de Matemáticas Rápido 🔢 ¡Adivina la respuesta! #Shorts',
      ytDesc: '🧠 ¿Puedes resolver este reto matemático? 🤔 #retomatematico #matematicas #acertijo #desafiomental'
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
      await fbService.scheduleContent({
        message: v.fbDesc,
        type: 'video',
        mediaFile: mediaFile,
        scheduledTime: v.time
      });
      console.log(`✅ Uploaded to Facebook`);
      
      console.log(`Uploading to YouTube: ${v.file}`);
      await ytService.uploadVideo({
        title: v.ytTitle,
        description: v.ytDesc,
        mediaFile: mediaFile,
        madeForKids: false,
        scheduledTime: v.time,
        privacyStatus: 'private'
      });
      console.log(`✅ Uploaded to YouTube`);

      const newPath = path.join(outputDir, `subido_${v.file}`);
      fs.renameSync(filePath, newPath);
      console.log(`Renamed to subido_${v.file}`);

    } catch (err) {
      console.error(`Error processing ${v.file}:`, err);
    }
  }
}

run();
