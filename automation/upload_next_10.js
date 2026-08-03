require('dotenv').config();
const fs = require('fs');
const path = require('path');
const youtubeService = require('./src/services/youtube.service');

const outputDir = path.join(__dirname, '../output/viral-quiz');

async function main() {
  const allFiles = fs.readdirSync(outputDir);
  
  // Filter for available videos (not starting with subido_ or yt_subido_)
  const availableVideos = allFiles.filter(f => f.endsWith('.mp4') && !f.startsWith('subido_') && !f.startsWith('yt_subido_'));
  
  const videosToUpload = availableVideos.slice(0, 10);
  
  if (videosToUpload.length === 0) {
    console.log("No hay videos disponibles para subir.");
    return;
  }
  
  console.log(`Subiendo ${videosToUpload.length} videos...`);
  
  // Base Date for tomorrow
  const now = new Date();
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  let currentDayOffset = 0;
  
  for (let i = 0; i < videosToUpload.length; i++) {
    const filename = videosToUpload[i];
    const filePath = path.join(outputDir, filename);
    const mediaFile = { path: filePath };
    
    // Extract category from filename (e.g. ViralQuizVideo_acertijo_math_id_11.mp4)
    const parts = filename.split('_');
    let category = parts.length > 1 ? parts[1] : "Conocimiento";
    category = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize
    
    // Generate Title
    let title;
    if (i % 2 === 0) {
      title = `🧠 ¿Puedes resolver esto en 5 segundos? Reto de ${category} #Shorts`;
    } else {
      title = `Reto de ${category} Rápido ⏳ ¡Adivina la respuesta! #Shorts`;
    }
    
    // Generate Description
    const description = `¡Pon a prueba tu mente con este reto rápido de ${category}! 🧠✨\n\n¿Lograste adivinar la respuesta correcta antes de que acabe el tiempo? ¡Déjala en los comentarios y reta a tus amigos! 👇\n\n#Shorts #RetoMental #Trivia #${category.replace(/\s+/g, '')} #Curiosidades`;
    
    // Determine Timestamp
    const uploadDate = new Date(startDay);
    uploadDate.setDate(uploadDate.getDate() + currentDayOffset);
    
    if (i % 2 === 0) {
      // 12:00 PM
      uploadDate.setHours(12, 0, 0, 0);
    } else {
      // 20:00 PM
      uploadDate.setHours(20, 0, 0, 0);
      currentDayOffset++; // Next day for the next pair
    }
    
    const scheduledTime = Math.floor(uploadDate.getTime() / 1000); // Unix timestamp in seconds
    
    console.log(`\nPreparando subida [${i+1}/10]:`);
    console.log(`Archivo: ${filename}`);
    console.log(`Título: ${title}`);
    console.log(`Fecha programada: ${uploadDate.toLocaleString()}`);
    
    try {
      await youtubeService.uploadVideo({
        title,
        description,
        privacyStatus: 'private',
        scheduledTime,
        mediaFile,
        madeForKids: false
      });
      
      console.log(`✅ ¡Subido exitosamente!`);
      
      // Rename file
      const newFilePath = path.join(outputDir, `subido_${filename}`);
      fs.renameSync(filePath, newFilePath);
      console.log(`Archivo renombrado a subido_${filename}`);
    } catch (err) {
      console.error(`❌ Error subiendo ${filename}:`, err);
    }
  }
  
  console.log("\nProceso finalizado.");
}

main();
