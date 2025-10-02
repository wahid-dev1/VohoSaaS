'use strict';

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id:       { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    userId:   { type: DataTypes.UUID, allowNull: true },
    action:   { type: DataTypes.STRING, allowNull: false }, // e.g., 'auth.login'
    ip:       { type: DataTypes.STRING, allowNull: true },
    userAgent:{ type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'AuditLogs',
    indexes: [{ fields: ['tenantId', 'createdAt'] }],
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    AuditLog.belongsTo(models.User,   { foreignKey: 'userId' });
  };

  return AuditLog;
};
