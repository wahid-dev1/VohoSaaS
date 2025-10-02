// server/src/services/metrics.js
const { Op } = require('sequelize');
const { CallLog } = require('../db/models');

async function getMetrics(tenantId) {
  const now = Date.now();
  const since24h = new Date(now - 24*60*60*1000);
  const since15m = new Date(now - 15*60*1000);

  const totalCalls = await CallLog.count({
    where: { tenantId, createdAt: { [Op.gte]: since24h } }
  });

  const rows = await CallLog.findAll({
    attributes: ['userId'],
    where: { tenantId, createdAt: { [Op.gte]: since15m } },
    group: ['userId']
  });
  const activeUsers = rows.filter(r => !!r.userId).length;

  return { totalCalls, activeUsers };
}

module.exports = { getMetrics };
