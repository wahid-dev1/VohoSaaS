// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const cfg = require('../config');
const { User } = require('../db/models');

function signToken(user, tenant) {
  // Include tenant slug in token to enforce isolation later
  return jwt.sign(
    { sub: String(user.id), role: user.role, tenant: tenant.slug },
    cfg.jwtSecret,
    { expiresIn: '2h' }
  );
}

async function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, cfg.jwtSecret); // { sub, role, tenant }
    req.auth = payload;

    // If a tenant context is present (resolved by subdomain/header), block cross-tenant access
    if (req.tenant && payload.tenant !== req.tenant.slug) {
      return res.status(403).json({ error: 'Cross-tenant access blocked' });
    }

    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { signToken, requireAuth };
