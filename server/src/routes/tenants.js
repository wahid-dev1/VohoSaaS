// server/src/routes/tenants.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Tenant, User } = require('../db/models');
const { signToken } = require('../middleware/auth');

const r = express.Router();

/**
 * POST /api/tenants/signup
 * Body: { name, slug, email, password, logoUrl?, primaryColor? }
 * Creates a tenant + initial admin user, returns JWT.
 */
r.post('/signup', async (req, res, next) => {
  try {
    const { name, slug, email, password, logoUrl, primaryColor } = req.body || {};
    if (!name || !slug || !email || !password) {
      return res.status(400).json({ error: 'Missing fields (name, slug, email, password)' });
    }

    const existing = await Tenant.findOne({ where: { slug: String(slug).toLowerCase() } });
    if (existing) return res.status(409).json({ error: 'Slug already taken' });

    const tenant = await Tenant.create({
      name,
      slug: String(slug).toLowerCase(),
      logoUrl,
      primaryColor
    });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      role: 'admin',
      tenantId: tenant.id
    });

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
r.get('/resolve', async (req, res, next) => {
  try {
    const domain = req.query.domain || req.headers.host;
    const headerSlug = req.header('x-tenant');
    const qSlug = req.query.slug;

    const slug = (qSlug || headerSlug || getTenantSlugFromHost(domain) || '').toLowerCase();
    if (!slug) return res.status(400).json({ ok: false, error: 'No tenant slug in host or params' });

    const tenant = await Tenant.findOne({ where: { slug } });
    return res.json({
      ok: true,
      slug,
      found: !!tenant,
      tenant: tenant ? { id: tenant.id, name: tenant.name } : null
    });
  } catch (err) { next(err); }
});

// GET /api/tenants/branding
// Returns minimal branding props for a tenant (slug from middleware/header/query)
r.get('/branding', async (req, res, next) => {
  try {
    const slug =
      (req.tenant && req.tenant.slug) ||
      (req.header('x-tenant') || req.query.slug || getTenantSlugFromHost(req.query.domain || req.headers.host));

    if (!slug) return res.status(400).json({ error: 'Missing tenant slug' });
    const tenant = await Tenant.findOne({ where: { slug: String(slug).toLowerCase() } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    res.json({
      slug: tenant.slug,
      name: tenant.name,
      logoUrl: tenant.logoUrl || null,
      primaryColor: tenant.primaryColor || '#0ea5e9'
    });
  } catch (e) { next(e); }
});
module.exports = r;
