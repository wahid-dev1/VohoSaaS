// server/src/routes/calls.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { makeTestCall } = require('../services/ultravox');
const { CallLog, AuditLog } = require('../db/models');
const { getMetrics } = require('../services/metrics');

const r = express.Router();

// POST /api/calls/test
r.post('/test', requireAuth, async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'No tenant context' });
    const data = await makeTestCall({ tenant: req.tenant, user: req.user });

    await CallLog.create({
      tenantId: req.tenant.id,
      userId: req.user.id,
      action: 'ultravox.test_call',
      status: data.status,
      metadata: data
    });

    await AuditLog.create({
      tenantId: req.tenant.id,
      userId: req.user.id,
      action: 'ultravox.test_call',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const metrics = await getMetrics(req.tenant.id);
    res.json({ ok: true, data, metrics });
  } catch (e) { next(e); }
});

module.exports = r;
