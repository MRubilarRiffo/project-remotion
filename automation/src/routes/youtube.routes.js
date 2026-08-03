const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtube.controller');
const multer = require('multer');
const { validateSchema } = require('../middlewares/validate.middleware');
const { scheduleYoutubeSchema } = require('../validators/youtube.validator');

// Almacenamiento temporal en disco
const upload = multer({ dest: 'uploads/' });

// Ruta para programar videos
router.post(
  '/schedule',
  upload.fields([{ name: 'media', maxCount: 1 }]),
  validateSchema(scheduleYoutubeSchema),
  youtubeController.scheduleVideo
);

// Ruta para obtener las analíticas/estadísticas del canal
router.get(
  '/analytics',
  youtubeController.getAnalytics
);

// Ruta para obtener las analíticas detalladas de los videos recientes
router.get(
  '/analytics/videos',
  youtubeController.getVideosAnalytics
);

module.exports = router;
