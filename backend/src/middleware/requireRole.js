/**
 * Middleware factory pentru verificarea rolului utilizatorului
 * Restrictționează accesul la endpoint-uri pe baza rolurilor permise
 * @param {...string} allowedRoles - Lista de roluri permise
 * @returns {Function} Middleware Express
 */
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
