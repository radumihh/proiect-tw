// middleware pentru verificare rol user
// restrictioneaza access pe baza de roluri
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Neautentificat' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acces interzis' });
    }

    next();
  };
}

module.exports = requireRole;
