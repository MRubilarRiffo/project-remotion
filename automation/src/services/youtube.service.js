const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuración básica de OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Si tenemos un refresh token guardado, lo seteamos
if (process.env.YOUTUBE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
  });
}

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

const uploadVideo = async ({ title, description, privacyStatus, scheduledTime, mediaFile, thumbnailFile, madeForKids = false }) => {
  try {
    // Si scheduledTime está presente, el status debe ser "private"
    // para que se programe correctamente según la API de YouTube.
    const finalPrivacyStatus = scheduledTime ? 'private' : privacyStatus;

    const requestBody = {
      snippet: {
        title: title,
        description: description || '',
        categoryId: '24', // 24 = Entertainment
      },
      status: {
        privacyStatus: finalPrivacyStatus,
        selfDeclaredMadeForKids: madeForKids,
      }
    };

    if (scheduledTime) {
      // Fecha en formato ISO 8601, ej: 2026-06-15T12:00:00Z
      const timeMs = parseInt(scheduledTime, 10) * 1000;
      requestBody.status.publishAt = new Date(timeMs).toISOString();
    }

    const res = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody,
      media: {
        body: fs.createReadStream(mediaFile.path),
      },
    });

    // Subir miniatura si se proporciona
    if (thumbnailFile && thumbnailFile.path) {
      await youtube.thumbnails.set({
        videoId: res.data.id,
        media: {
          body: fs.createReadStream(thumbnailFile.path),
        },
      });
    }

    return res.data;
  } catch (error) {
    console.error('Error en youtubeService.uploadVideo:', error);
    throw error;
  }
};

const getChannelAnalytics = async () => {
  try {
    const res = await youtube.channels.list({
      part: 'statistics,snippet',
      mine: true
    });

    if (!res.data.items || res.data.items.length === 0) {
      throw new Error('No se encontró el canal para el usuario autenticado.');
    }

    const channel = res.data.items[0];
    return {
      channelId: channel.id,
      title: channel.snippet.title,
      statistics: channel.statistics
    };
  } catch (error) {
    console.error('Error en youtubeService.getChannelAnalytics:', error);
    throw error;
  }
};

const getVideosAnalytics = async (maxResults = 50) => {
  try {
    // 1. Obtener el ID de la lista de reproducción "uploads" del canal
    const channelRes = await youtube.channels.list({
      part: 'contentDetails',
      mine: true
    });

    if (!channelRes.data.items || channelRes.data.items.length === 0) {
      throw new Error('No se encontró el canal para el usuario autenticado.');
    }

    const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Obtener los últimos videos de esa lista de reproducción
    const playlistItemsRes = await youtube.playlistItems.list({
      part: 'contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: maxResults
    });

    if (!playlistItemsRes.data.items || playlistItemsRes.data.items.length === 0) {
      return []; // No hay videos
    }

    const videoIds = playlistItemsRes.data.items.map(item => item.contentDetails.videoId);

    // 3. Obtener las estadísticas detalladas de cada video
    const videosRes = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoIds.join(',')
    });

    return videosRes.data.items.map(video => ({
      videoId: video.id,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      statistics: video.statistics
    }));
  } catch (error) {
    console.error('Error en youtubeService.getVideosAnalytics:', error);
    throw error;
  }
};

module.exports = {
  uploadVideo,
  getChannelAnalytics,
  getVideosAnalytics,
  oauth2Client // Exportado por si necesitamos generar la URL de auth en el futuro
};
