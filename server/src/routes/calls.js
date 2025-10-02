// server/src/routes/calls.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { makeTestCall } = require('../services/ultravox');
const { CallLog, AuditLog } = require('../db/models');
const { getMetrics } = require('../services/metrics');

const r = express.Router();

// POST /api/calls/test  -> triggers a mocked Ultravox call, logs it, returns metrics
r.post('/test', requireAuth, async (req, res, next) => {
  try {
    const tenant = req.tenant;
    if (!tenant) return res.status(400).json({ error: 'No tenant in context' });

    const data = await makeTestCall({ tenant, user: req.user });

    await CallLog.create({
      tenantId: tenant.id,
      userId: req.user.id,
      action: 'ultravox.test_call',
      status: data.status,
      metadata: data
    });

    await AuditLog.create({
      tenantId: tenant.id,
      userId: req.user.id,
      action: 'ultravox.test_call',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const metrics = await getMetrics(tenant.id);
    res.json({ ok: true, data, metrics });
  } catch (e) { next(e); }
});

module.exports = r;
