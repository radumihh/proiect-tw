const authService = require('../services/authService');

// controller pentru auth
class AuthController {
  // handler pentru register user nou
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
      }

      const user = await authService.register(name, email, password, role);
      
      res.status(201).json({ 
        message: 'Utilizator creat cu succes',
        user 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // handler pentru login user existent
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email și parolă sunt obligatorii' });
      }

      const result = await authService.login(email, password);
      
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
