// server/src/db/config/config.js
require('dotenv').config();

module.exports = {
  development: { use_env_variable: 'DATABASE_URL', dialect: 'postgres', logging: false },
  test:        { dialect: 'sqlite', storage: ':memory:', logging: false },
  production:  { use_env_variable: 'DATABASE_URL', dialect: 'postgres', logging: false }
};