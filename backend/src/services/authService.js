const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// service pentru login si register
class AuthService {
  // inregistreaza user nou
  // hashuieste parola si salveaza in db
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

  // login user, verifica parola si genereaza token jwt
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
