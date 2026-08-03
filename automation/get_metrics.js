require('dotenv').config();
const youtubeService = require('./src/services/youtube.service');

async function main() {
  try {
    const channel = await youtubeService.getChannelAnalytics();
    console.log("=== CHANNEL ANALYTICS ===");
    console.log(JSON.stringify(channel, null, 2));

    const videos = await youtubeService.getVideosAnalytics(50);
    console.log("\n=== VIDEOS ANALYTICS ===");
    
    // Sort videos by viewCount descending to find the best ones
    videos.sort((a, b) => parseInt(b.statistics.viewCount || 0) - parseInt(a.statistics.viewCount || 0));
    
    console.log(JSON.stringify(videos, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
