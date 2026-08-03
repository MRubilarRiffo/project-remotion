require('dotenv').config();
const fs = require('fs');
const path = require('path');
const youtubeService = require('./src/services/youtube.service');

const outputDir = path.join(__dirname, '../output/viral-quiz');

async function main() {
  const allFiles = fs.readdirSync(outputDir);
  
  // Filter for available videos (not starting with subido_ or yt_subido_)
  const availableVideos = allFiles.filter(f => f.endsWith('.mp4') && !f.startsWith('subido_') && !f.startsWith('yt_subido_'));
  
  if (availableVideos.length === 0) {
    console.log("No hay videos disponibles para subir.");
    return;
  }
  
  const filename = availableVideos[0];
  const filePath = path.join(outputDir, filename);
  const mediaFile = { path: filePath };
  
  // Extract category from filename
  const parts = filename.split('_');
  let category = parts.length > 1 ? parts[1] : "Conocimiento";
  category = category.charAt(0).toUpperCase() + category.slice(1);
  
  const title = `🧠 ¿Puedes resolver esto en 5 segundos? Reto de ${category} #Shorts`;
  const description = `¡Pon a prueba tu mente con este reto rápido de ${category}! 🧠✨\n\n¿Lograste adivinar la respuesta correcta antes de que acabe el tiempo? ¡Déjala en los comentarios y reta a tus amigos! 👇\n\n#Shorts #RetoMental #Trivia #${category.replace(/\s+/g, '')} #Curiosidades`;
  
  console.log(`Preparando subida inmediata:`);
  console.log(`Archivo: ${filename}`);
  console.log(`Título: ${title}`);
  
  try {
    await youtubeService.uploadVideo({
      title,
      description,
      privacyStatus: 'public',
      mediaFile,
      madeForKids: false
    });
    
    console.log(`✅ ¡Subido exitosamente y publicado ahora mismo!`);
    
    // Rename file
    const newFilePath = path.join(outputDir, `subido_${filename}`);
    fs.renameSync(filePath, newFilePath);
    console.log(`Archivo renombrado a subido_${filename}`);
  } catch (err) {
    console.error(`❌ Error subiendo ${filename}:`, err);
  }
}

main();
