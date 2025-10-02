const { Tenant } = require('../db/models');
const { getTenantSlugFromHost } = require('../utils/tenantHost');

async function tenantResolver(req, res, next) {
  try {
    let slug = getTenantSlugFromHost(req.headers.host);
    if (!slug && req.header('x-tenant')) slug = String(req.header('x-tenant')).toLowerCase();

    if (!slug) return next(); // allow public routes like signup/login

    const tenant = await Tenant.findOne({ where: { slug } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    req.tenant = tenant;
    next();
  } catch (err) { next(err); }
}

module.exports = { tenantResolver };
