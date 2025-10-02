// server/src/index.js  (only the middle part changes to add tenantResolver + routes)
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cfg = require('./config');
const { sequelize } = require('./db/models');
const { tenantResolver } = require('./middleware/tenantResolver');

const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const adminRoutes = require('./routes/admin');
const callsRoutes = require('./routes/calls');
const metricsRoutes = require('./routes/metrics');
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost';

async function start() {
  await sequelize.authenticate();

  const app = express();
  app.use(helmet());

  app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser clients

    const ok =
      cfg.corsOrigins.includes(origin) ||
      (cfg.baseDomain && origin.match(new RegExp(`^https?://([a-z0-9-]+\\.)?${cfg.baseDomain}(:\\d+)?$`)));

    cb(ok ? null : new Error("Not allowed by CORS: " + origin), ok);
  },
  credentials: true,
}));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

  // Resolve tenant from subdomain or x-tenant header
  app.use(tenantResolver);

  // Health + base
  app.get('/', (_req, res) => res.send('API is up'));
  app.get('/healthz', async (_req, res) => {
    try { await sequelize.query('select 1+1 as result;'); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
  });

  // Routes
  app.use('/api/tenants', tenantRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/calls', callsRoutes);
  app.use('/api/metrics', metricsRoutes);
  // Error handler
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  });

  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

start().catch(err => {
  console.error('Failed to start API:', err.message);
  process.exit(1);
});

module.exports = { sequelize };
