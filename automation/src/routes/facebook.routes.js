const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebook.controller');
const multer = require('multer');
const { validateSchema } = require('../middlewares/validate.middleware');
const { scheduleFacebookSchema } = require('../validators/facebook.validator');

// Almacenamiento temporal en disco
const upload = multer({ dest: 'uploads/' });

// Ruta para programar contenido, ahora acepta archivos "media" y "thumbnail"
router.post(
  '/schedule',
  upload.fields([{ name: 'media', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
  validateSchema(scheduleFacebookSchema),
  facebookController.schedulePost
);

// Ruta para obtener las analíticas/estadísticas de la página
router.get(
  '/analytics',
  facebookController.getAnalytics
);

// Ruta para obtener las analíticas detalladas de las publicaciones recientes
router.get(
  '/analytics/posts',
  facebookController.getPostsAnalytics
);

module.exports = router;
