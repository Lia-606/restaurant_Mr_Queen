// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, logoutUsuario, me } = require('../controllers/usuarioController');
const auth = require('../middleware/authMiddleware');

router.post('/registrar', registrarUsuario); // en producción proteger con rol admin
router.post('/login', loginUsuario);
router.post('/logout', logoutUsuario);
router.get('/me', auth, me);

module.exports = router;
