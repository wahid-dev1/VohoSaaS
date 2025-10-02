// server/src/services/ultravox.js
const axios = require('axios');
const { randomUUID } = require('crypto');
const cfg = require('../config');

async function makeTestCall({ tenant, user }) {
  if (cfg.ultravoxMock) {
    return { id: randomUUID(), status: 'mocked-ok', at: new Date().toISOString() };
  }
  const resp = await axios.post(
    `${cfg.ultravoxUrl}/agents`,
    { name: `Test-${tenant.slug}`, metadata: { user: String(user.id) } },
    { headers: { Authorization: `Bearer ${cfg.ultravoxKey}` } }
  );
  return resp.data;
}

module.exports = { makeTestCall };
