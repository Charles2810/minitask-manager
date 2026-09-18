const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montaje de rutas de la API
app.use('/api', taskRoutes);

// Ruta por defecto para recursos no encontrados
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en la API.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[API Server] Servidor corriendo en http://localhost:${PORT}`);
});
