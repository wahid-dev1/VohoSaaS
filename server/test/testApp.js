const express = require('express');
const bodyParser = require('body-parser');
const tenantRoutes = require('../src/routes/tenants');
const authRoutes = require('../src/routes/auth');

// If you want to close DB after tests, import the real sequelize
const { sequelize } = require('./__mocks__/index');

async function buildTestApp() {
  const app = express();
  app.use(bodyParser.json());

  // Mount routes
  app.use('/api/tenants', tenantRoutes);
  app.use('/api/auth', authRoutes);

  return app;
}

module.exports = { buildTestApp, sequelize };
