const facebookService = require('../services/facebook.service');
const fs = require('fs');

const schedulePost = async (req, res) => {
  try {
    const { message, type, scheduled_time } = req.body;
    
    // Archivos subidos por multer
    const mediaFile = req.files?.['media']?.[0];
    const thumbnailFile = req.files?.['thumbnail']?.[0];

    if (type !== 'text' && !mediaFile) {
      return res.status(400).json({ error: 'Para imágenes o videos, se requiere subir un archivo en el campo "media".' });
    }

    // Llamar al servicio correspondiente
    const response = await facebookService.scheduleContent({
      message,
      type,
      mediaFile,
      thumbnailFile,
      scheduledTime: scheduled_time
    });

    // Limpiar archivos temporales de uploads/
    if (mediaFile) fs.unlinkSync(mediaFile.path);
    if (thumbnailFile) fs.unlinkSync(thumbnailFile.path);

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    // Intentar limpiar en caso de error
    try {
      if (req.files?.['media']?.[0]) fs.unlinkSync(req.files['media'][0].path);
      if (req.files?.['thumbnail']?.[0]) fs.unlinkSync(req.files['thumbnail'][0].path);
    } catch (e) {
      // Ignorar errores de limpieza
    }

    console.error('Error al programar publicación:', error.response?.data || error.message);
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
    const data = await facebookService.getPageAnalytics();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error al obtener analíticas de Facebook:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const errorDetails = error.response?.data?.error || { message: error.message };

    return res.status(statusCode).json({
      success: false,
      error: errorDetails
    });
  }
};

const getPostsAnalytics = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 25;
    const data = await facebookService.getPostsAnalytics(limit);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error al obtener analíticas de publicaciones de Facebook:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const errorDetails = error.response?.data?.error || { message: error.message };

    return res.status(statusCode).json({
      success: false,
      error: errorDetails
    });
  }
};

module.exports = {
  schedulePost,
  getAnalytics,
  getPostsAnalytics
};
