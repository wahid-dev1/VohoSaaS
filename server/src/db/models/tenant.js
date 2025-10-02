'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define('Tenant', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    logoUrl: { type: DataTypes.STRING },
    primaryColor: { type: DataTypes.STRING, defaultValue: '#0ea5e9' },
  }, {
    tableName: 'Tenants',
  });

  Tenant.associate = (models) => {
    Tenant.hasMany(models.User,     { foreignKey: 'tenantId' });
    Tenant.hasMany(models.CallLog,  { foreignKey: 'tenantId' });
    Tenant.hasMany(models.AuditLog, { foreignKey: 'tenantId' });
  };

  return Tenant;
};
