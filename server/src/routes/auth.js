const express = require('express');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { Tenant, User, AuditLog } = require('../db/models');
const { signToken, requireAuth } = require('../middleware/auth');

const r = express.Router();

function resolveTenantSlug(req) {
  return (req.tenant && req.tenant.slug)
    || (req.header('x-tenant') && String(req.header('x-tenant')).toLowerCase())
    || (req.body && req.body.slug && String(req.body.slug).toLowerCase())
    || null;
}

const loginLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

/**
 * POST /api/auth/login
 * Logs in and returns JWT
 */
r.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const tenantSlug = resolveTenantSlug(req);
    const { email, password } = req.body || {};
    if (!tenantSlug || !email || !password) return res.status(400).json({ error: 'Missing tenant/email/password' });

    const tenant = await Tenant.findOne({ where: { slug: tenantSlug } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const user = await User.findOne({ where: { email: String(email).toLowerCase(), tenantId: tenant?.id } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user, tenant);

    await AuditLog.create({
      tenantId: tenant.id,
      userId: user.id,
      action: 'auth.login',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name }
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/auth/me
 */
r.get('/me', requireAuth, async (req, res, next) => {
  try {
    res.json({
      user: { id: req.user.id, email: req.user.email, role: req.user.role },
      tenant: { id: req.tenant.id, slug: req.tenant.slug, name: req.tenant.name }
    });
  } catch (e) { next(e); }
});

module.exports = r;
