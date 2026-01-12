// rute pentru auth si register
// publice, fara auth
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// post register user nou
router.post('/register', authController.register.bind(authController));

// post login user
router.post('/login', authController.login.bind(authController));

module.exports = router;
