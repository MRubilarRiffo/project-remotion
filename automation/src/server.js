const express = require('express');
const dotenv = require('dotenv');
const facebookRoutes = require('./routes/facebook.routes');
const youtubeRoutes = require('./routes/youtube.routes');

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Montar rutas
app.use('/api/facebook', facebookRoutes);
app.use('/api/youtube', youtubeRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
