'use strict';

module.exports = (sequelize, DataTypes) => {
  const CallLog = sequelize.define('CallLog', {
    id:       { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tenantId: { type: DataTypes.UUID, allowNull: false },
    userId:   { type: DataTypes.UUID, allowNull: true },
    action:   { type: DataTypes.STRING, allowNull: false }, // e.g., 'ultravox.test_call'
    status:   { type: DataTypes.STRING, allowNull: true },  // e.g., 'mocked-ok'
    metadata: { type: DataTypes.JSONB, allowNull: true },   // raw response / payload
  }, {
    tableName: 'CallLogs',
    indexes: [{ fields: ['tenantId', 'createdAt'] }],
  });

  CallLog.associate = (models) => {
    CallLog.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    CallLog.belongsTo(models.User,   { foreignKey: 'userId' });
  };

  return CallLog;
};
