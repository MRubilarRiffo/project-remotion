const youtubeService = require('../services/youtube.service');
const fs = require('fs');

const scheduleVideo = async (req, res) => {
  try {
    const { title, description, privacy_status, scheduled_time } = req.body;
    
    // Archivos subidos por multer
    const mediaFile = req.files?.['media']?.[0];

    // Validación custom de archivo
    if (!mediaFile) {
      return res.status(400).json({ error: 'Se requiere subir un archivo de video en el campo "media".' });
    }

    // Llamar al servicio
    const response = await youtubeService.uploadVideo({
      title,
      description,
      privacyStatus: privacy_status,
      scheduledTime: scheduled_time,
      mediaFile
    });

    // Limpiar archivos temporales de uploads/
    if (mediaFile) fs.unlinkSync(mediaFile.path);

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    // Intentar limpiar en caso de error
    try {
      if (req.files?.['media']?.[0]) fs.unlinkSync(req.files['media'][0].path);
    } catch (e) {
      // Ignorar errores de limpieza
    }

    console.error('Error al programar video en YouTube:', error.message);
    const statusCode = error.response?.status || 500;
    const errorDetails = error.response?.data?.error || { message: error.message };

    return res.status(statusCode).json({
      success: false,
      error: errorDetails
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const data = await youtubeService.getChannelAnalytics();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error al obtener analíticas de YouTube:', error.message);
    const statusCode = error.response?.status || 500;
    const errorDetails = error.response?.data?.error || { message: error.message };

    return res.status(statusCode).json({
      success: false,
      error: errorDetails
    });
  }
};

const getVideosAnalytics = async (req, res) => {
  try {
    const maxResults = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const data = await youtubeService.getVideosAnalytics(maxResults);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error al obtener analíticas de videos de YouTube:', error.message);
    const statusCode = error.response?.status || 500;
    const errorDetails = error.response?.data?.error || { message: error.message };

    return res.status(statusCode).json({
      success: false,
      error: errorDetails
    });
  }
};

module.exports = {
  scheduleVideo,
  getAnalytics,
  getVideosAnalytics
};
