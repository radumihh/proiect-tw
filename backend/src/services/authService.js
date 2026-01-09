const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Serviciu pentru gestionarea autentificării utilizatorilor
 * @class AuthService
 */
class AuthService {
  /**
   * Înregistrează un utilizator nou în sistem
   * @param {string} name - Numele complet al utilizatorului
   * @param {string} email - Adresa de email unică
   * @param {string} password - Parola în text clar (va fi hash-uită)
   * @param {string} role - Rolul utilizatorului ('student' sau 'professor')
   * @returns {Promise<Object>} Datele utilizatorului creat (fără parolă)
   * @throws {Error} Dacă email-ul este deja înregistrat sau rolul este invalid
   */
  async register(name, email, password, role = 'student') {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email-ul este deja înregistrat');
    }

    if (!['student', 'professor'].includes(role)) {
      throw new Error('Rol invalid');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  /**
   * Autentifică un utilizator și generează token JWT
   * @param {string} email - Adresa de email a utilizatorului
   * @param {string} password - Parola în text clar
   * @returns {Promise<Object>} Obiect cu token JWT și datele utilizatorului
   * @throws {Error} Dacă credențialele sunt invalide
   */
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Credențiale invalide');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credențiale invalide');
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
