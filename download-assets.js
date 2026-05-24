import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    console.log(`Downloading ${url} to ${dest}...`);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✓ Download complete: ${dest}`);
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const main = async () => {
  const musicDir = path.join(__dirname, "public", "music");
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  // Descargar música de fondo
  const bgMusicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
  const bgMusicDest = path.join(musicDir, "background.mp3");

  try {
    await download(bgMusicUrl, bgMusicDest);
    console.log("🎉 All assets downloaded successfully!");
  } catch (err) {
    console.error("❌ Error downloading assets:", err);
    process.exit(1);
  }
};

main();
