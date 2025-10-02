'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CallLogs', {
      id:        { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true },
      tenantId:  { type: Sequelize.UUID, allowNull: false, references: { model: 'Tenants', key: 'id' }, onDelete: 'CASCADE' },
      userId:    { type: Sequelize.UUID, allowNull: true, references: { model: 'Users', key: 'id' }, onDelete: 'SET NULL' },
      action:    { type: Sequelize.STRING, allowNull: false },  // e.g., 'ultravox.test_call'
      status:    { type: Sequelize.STRING, allowNull: true },
      metadata:  { type: Sequelize.JSONB, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('CallLogs', ['tenantId', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('CallLogs');
  }
};
