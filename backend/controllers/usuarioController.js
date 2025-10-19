// backend/controllers/usuarioController.js
const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generarToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registrar usuario (solo admin debería usar esto en producción)
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, contrasena, rol } = req.body;
    const pass = contraseña || contrasena;

    if (!nombre || !correo || !pass)
      return res.status(400).json({ mensaje: 'Faltan datos' });

    const existe = await Usuario.findOne({ correo });
    if (existe)
      return res.status(400).json({ mensaje: 'Correo ya registrado' });

    const usuario = await Usuario.create({ nombre, correo, contraseña: pass, rol });
    res.status(201).json({
      mensaje: 'Usuario creado',
      usuario: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

// 🔐 LOGIN DE USUARIO
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña, contrasena } = req.body;
    const pass = contraseña || contrasena;

    if (!correo || !pass)
      return res.status(400).json({ mensaje: 'Faltan datos' });

    const usuario = await Usuario.findOne({ correo });
    if (!usuario)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (usuario.estado !== 'activo')
      return res.status(403).json({ mensaje: 'Usuario inactivo' });

    const ok = await usuario.compararContraseña(pass);
    if (!ok)
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = generarToken({ id: usuario._id, rol: usuario.rol });

    // Enviar cookie segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // cambia a true en producción con HTTPS
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1h
    });

    res.json({
      mensaje: 'Login correcto',
      usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en login' });
  }
};

// Cerrar sesión
exports.logoutUsuario = (req, res) => {
  res.clearCookie('token');
  res.json({ mensaje: 'Logout ok' });
};

// Obtener datos del usuario logueado
exports.me = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-contraseña');
    if (!usuario)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' });
  }
};
