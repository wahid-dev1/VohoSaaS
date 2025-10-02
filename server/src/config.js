// server/src/config.js
require('dotenv').config();

function csv(val, fallback) {
  const v = (val || fallback || '').trim();
  return v ? v.split(',').map(s => s.trim()) : [];
}

module.exports = {
  // App
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Security
  jwtSecret: process.env.JWT_SECRET || 'change-me',

  // CORS
  corsOrigins: csv(process.env.CORS_ORIGIN, 'http://localhost'),

  // Multi-tenant base domain (for subdomain routing)
  baseDomain: process.env.BASE_DOMAIN || 'lvh.me',

  // External integration (Ultravox)
  ultravoxUrl: process.env.ULTRAVOX_API_URL || 'https://api.ultravox.ai',
  ultravoxKey: process.env.ULTRAVOX_API_KEY || '',
  ultravoxMock: String(process.env.ULTRAVOX_MOCK || 'true').toLowerCase() !== 'false',
};
