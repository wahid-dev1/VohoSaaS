const express = require('express');
const bcrypt = require('bcryptjs');
const { Tenant, User, AuditLog } = require('../db/models');
const { signToken } = require('../middleware/auth');
const { getTenantSlugFromHost } = require('../utils/tenantHost');

const r = express.Router();

/**
 * POST /api/tenants/signup
 * Body: { name, slug, email, password, logoUrl?, primaryColor? }
 * Creates a tenant and its first admin user.
 */
r.post('/signup', async (req, res, next) => {
  try {
    const { name, slug, email, password, logoUrl, primaryColor } = req.body || {};
    if (!name || !slug || !email || !password) {
      return res.status(400).json({ error: 'Missing fields (name, slug, email, password)' });
    }

    const normalized = String(slug).toLowerCase();
    const exists = await Tenant.findOne({ where: { slug: normalized } });
    if (exists) return res.status(409).json({ error: 'Slug already taken' });

    const tenant = await Tenant.create({ name, slug: normalized, logoUrl, primaryColor });
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash,
      role: 'admin',
      tenantId: tenant.id
    });

    await AuditLog.create({
      tenantId: tenant.id,
      userId: user.id,
      action: 'tenant.signup',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const token = signToken(user, tenant);
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name }
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/tenants/resolve
 * Returns tenant from Host, header, or ?slug.
 */
r.get('/resolve', async (req, res, next) => {
  try {
    const domain = req.query.domain || req.headers.host;
    const headerSlug = req.header('x-tenant');
    const qSlug = req.query.slug;
    const slug = (qSlug || headerSlug || getTenantSlugFromHost(domain) || '').toLowerCase();
    if (!slug) return res.status(400).json({ ok: false, error: 'No tenant slug' });

    const tenant = await Tenant.findOne({ where: { slug } });
    res.json({ ok: true, slug, found: !!tenant });
  } catch (e) { next(e); }
});

/**
 * GET /api/tenants/branding
 * Returns logo/color for a tenant.
 */
r.get('/branding', async (req, res, next) => {
  try {
    const slug = (req.header('x-tenant') || req.query.slug || '').toLowerCase();
    if (!slug) return res.status(400).json({ error: 'Missing tenant slug' });

    const tenant = await Tenant.findOne({ where: { slug } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    res.json({
      slug: tenant.slug,
      name: tenant.name,
      logoUrl: tenant.logoUrl || null,
      primaryColor: tenant.primaryColor || '#0ea5e9'
    });
  } catch (e) { next(e); }
});

/**
 * GET /api/tenants/:slug
 * Fetch tenant by slug
 */
r.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const tenant = await Tenant.findOne({ where: { slug } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    res.json({ id: tenant.id, slug: tenant.slug, name: tenant.name });
  } catch (e) { next(e); }
});

module.exports = r;
