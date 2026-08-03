const fs = require('fs');
const path = require('path');

function getWavDuration(filePath) {
  const buffer = fs.readFileSync(filePath);
  // Read byte rate from header (offset 28)
  const byteRate = buffer.readUInt32LE(28);
  
  // Search for 'data' chunk
  let offset = 12;
  while (offset < buffer.length - 8) {
    const chunkId = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    if (chunkId === 'data') {
      return chunkSize / byteRate;
    }
    offset += 8 + chunkSize;
  }
  // Fallback if data chunk not explicitly found
  return (buffer.length - 44) / byteRate;
}

const dataPath = path.join(__dirname, 'src/templates/storytime-summary/data/storytime_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const scenes = data[0].scenes;
let totalSeconds = 0;
let totalFrames = 0;

console.log('--- AUDITING SCENE DURATIONS VS AUDIO LENGTHS ---');

scenes.forEach((scene, idx) => {
  const audioRelPath = scene.voiceover || scene.audio;
  if (audioRelPath) {
    const fullPath = path.join(__dirname, 'public', audioRelPath);
    if (fs.existsSync(fullPath)) {
      const audioSeconds = getWavDuration(fullPath);
      // We add a 0.8 second buffer after the narrator stops speaking so the transition breathes naturally
      const recommendedSeconds = Math.max(8, Number((audioSeconds + 0.8).toFixed(2)));
      
      console.log(`Scene ${idx + 1}: Old duration = ${scene.durationInSeconds}s | Audio duration = ${audioSeconds.toFixed(2)}s | New duration = ${recommendedSeconds}s`);
      
      scene.durationInSeconds = recommendedSeconds;
      // Calculate exact frames at 30 fps
      const frames = Math.round(recommendedSeconds * 30);
      scene.durationInFrames = frames;
      
      totalSeconds += recommendedSeconds;
      totalFrames += frames;
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  }
});

console.log('-------------------------------------------------');
console.log(`NEW TOTAL VIDEO DURATION: ${totalSeconds.toFixed(2)} seconds (${Math.floor(totalSeconds / 60)}m ${(totalSeconds % 60).toFixed(0)}s) | Total Frames: ${totalFrames}`);

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated storytime_data.json with exact audio durations!');
