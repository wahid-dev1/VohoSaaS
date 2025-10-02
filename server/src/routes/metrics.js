// server/src/routes/metrics.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getMetrics } = require('../services/metrics');

const r = express.Router();

// GET /api/metrics  (requires tenant context + auth)
r.get('/', requireAuth, async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'No tenant context' });
    const metrics = await getMetrics(req.tenant.id);
    res.json(metrics);
  } catch (e) { next(e); }
});

module.exports = r;
