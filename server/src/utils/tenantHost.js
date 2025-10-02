// server/src/utils/tenantHost.js
const cfg = require('../config');

/**
 * Extract tenant slug from a full Host header.
 * - Works with base domains like lvh.me, example.com, etc.
 * - Returns null if no tenant subdomain is present.
 */
function getTenantSlugFromHost(hostHeader) {
  if (!hostHeader) return null;
  const host = String(hostHeader).split(':')[0].toLowerCase(); // strip port
  const parts = host.split('.');
  const base = (cfg.baseDomain || '').toLowerCase();

  if (base && host === base) return null;             // root domain -> no tenant
  if (base && host.endsWith(`.${base}`)) {
    const subParts = parts.slice(0, parts.length - base.split('.').length);
    if (subParts.length === 0) return null;
    return subParts[0] === 'www' ? (subParts[1] || null) : subParts[0];
  }

  // Fallback: any 3+ part host => first label is slug (e.g., acme.dev.local)
  if (parts.length >= 3) return parts[0];
  return null;
}

module.exports = { getTenantSlugFromHost };
