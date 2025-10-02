// server/src/routes/admin.js
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { User } = require('../db/models');

const r = express.Router();

// GET /api/admin/users  (admin-only within tenant)
r.get('/users', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { tenantId: req.tenant.id },
      attributes: ['id', 'email', 'role', 'createdAt']
    });
    res.json(users);
  } catch (e) { next(e); }
});

module.exports = r;
