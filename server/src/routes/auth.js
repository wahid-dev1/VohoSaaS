// server/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Tenant, User } = require('../db/models');
const { signToken } = require('../middleware/auth');

const r = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password, slug? }
 * - Tenant slug can come from subdomain/x-tenant header (preferred) or body.slug fallback
 */
r.post('/login', async (req, res, next) => {
  try {
    const { email, password, slug } = req.body || {};

    // Resolve tenant from middleware (subdomain / header) or fallback to body
    const tenantSlug = (req.tenant && req.tenant.slug) || slug;
    if (!tenantSlug) return res.status(400).json({ error: 'Tenant slug required (subdomain or body.slug)' });

    const tenant = await Tenant.findOne({ where: { slug: String(tenantSlug).toLowerCase() } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const user = await User.findOne({
      where: { email: String(email).toLowerCase(), tenantId: tenant.id }
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user, tenant);
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = r;
