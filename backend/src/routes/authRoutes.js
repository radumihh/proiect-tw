/**
 * Rute pentru autentificare și înregistrare
 * Aceste endpoint-uri sunt publice (nu necesită autentificare)
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/register - Înregistrare utilizator nou
router.post('/register', authController.register.bind(authController));

// POST /auth/login - Autentificare utilizator
router.post('/login', authController.login.bind(authController));

module.exports = router;
