// server/src/middleware/tenantResolver.js
const { Tenant } = require('../db/models');
const { getTenantSlugFromHost } = require('../utils/tenantHost');

async function tenantResolver(req, res, next) {
  try {
    let slug = getTenantSlugFromHost(req.headers.host);  // subdomain if present
    if (!slug && req.header('x-tenant')) slug = req.header('x-tenant'); // header fallback

    if (!slug) return next();
    const tenant = await Tenant.findOne({ where: { slug } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    req.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { tenantResolver };
