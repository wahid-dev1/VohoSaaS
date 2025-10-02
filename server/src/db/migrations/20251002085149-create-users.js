'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id:           { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true },
      email:        { type: Sequelize.STRING, allowNull: false },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role:         { type: Sequelize.ENUM('admin','user'), allowNull: false, defaultValue: 'user' },
      tenantId:     { type: Sequelize.UUID, allowNull: false, references: { model: 'Tenants', key: 'id' }, onDelete: 'CASCADE' },
      createdAt:    { type: Sequelize.DATE, allowNull: false },
      updatedAt:    { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addConstraint('Users', {
      fields: ['email', 'tenantId'],
      type: 'unique',
      name: 'users_email_tenant_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
    // Drop the ENUM type Sequelize created for Users.role (Postgres-specific cleanup)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
  }
};
