// backend/app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Inicializar aplicación
const app = express();

// ======================
// ⚙️ Conectar a MongoDB
// ======================
connectDB();

// ======================
// 🌍 Middlewares globales
// ======================
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// ======================
// 🔐 Configuración CORS
// ======================
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:4000'
  ],
  credentials: true
}));

// ======================
// 🧱 Servir archivos del frontend
// ======================
// Se mantienen las rutas pero agregamos explícitamente las carpetas para evitar el 404
app.use('/html', express.static(path.join(__dirname, '../frontend/html')));
app.use('/img', express.static(path.join(__dirname, '../frontend/public/img')));
app.use('/css', express.static(path.join(__dirname, '../frontend/public/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ======================
// 📦 Importar rutas API
// ======================
const usuarioRoutes = require('./routes/usuarioRoutes'); // ✅ nombre correcto
const mesaRoutes = require('./routes/mesaRoutes');


// ======================
// 🔗 Usar rutas API
// ======================
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mesas', mesaRoutes);

// ======================
// 🌐 Rutas del frontend
// ======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// ======================
// 🚀 Iniciar servidor
// ======================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('===================================');
  console.log(`🚀 Servidor backend corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Frontend servido correctamente desde /frontend`);
  console.log('===================================');
});
