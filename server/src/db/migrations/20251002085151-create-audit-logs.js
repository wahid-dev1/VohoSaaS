'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuditLogs', {
      id:        { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true },
      tenantId:  { type: Sequelize.UUID, allowNull: false, references: { model: 'Tenants', key: 'id' }, onDelete: 'CASCADE' },
      userId:    { type: Sequelize.UUID, allowNull: true, references: { model: 'Users', key: 'id' }, onDelete: 'SET NULL' },
      action:    { type: Sequelize.STRING, allowNull: false }, // e.g., 'auth.login'
      ip:        { type: Sequelize.STRING, allowNull: true },
      userAgent: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex('AuditLogs', ['tenantId', 'createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('AuditLogs');
  }
};
