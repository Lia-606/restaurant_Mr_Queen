// backend/app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Inicializar aplicación
const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
const path = require('path');

// servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5500', // 🔧 cambia al puerto de tu frontend si usas otro
  credentials: true
}));

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');

// Usar rutas
app.use('/api/usuarios', usuarioRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('🍽️ API Restaurante Mr Queen funcionando correctamente');
});

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
