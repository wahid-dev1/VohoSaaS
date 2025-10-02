'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure pgcrypto for gen_random_uuid()
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

    await queryInterface.createTable('Tenants', {
      id:           { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true },
      name:         { type: Sequelize.STRING, allowNull: false },
      slug:         { type: Sequelize.STRING, allowNull: false, unique: true },
      logoUrl:      { type: Sequelize.STRING },
      primaryColor: { type: Sequelize.STRING, defaultValue: '#0ea5e9' },
      createdAt:    { type: Sequelize.DATE, allowNull: false },
      updatedAt:    { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Tenants');
  }
};
