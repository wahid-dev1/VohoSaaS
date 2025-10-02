// server/src/middleware/roles.js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: 'Unauthenticated' });
    if (req.auth.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
module.exports = { requireRole };
