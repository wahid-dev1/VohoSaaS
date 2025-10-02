'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email:       { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    passwordHash:{ type: DataTypes.STRING, allowNull: false },
    role:        { type: DataTypes.ENUM('admin','user'), defaultValue: 'user', allowNull: false },
    tenantId:    { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: 'Users',
    indexes: [{ unique: false, fields: ['tenantId'] }],
  });

  User.associate = (models) => {
    User.belongsTo(models.Tenant,  { foreignKey: 'tenantId' });
    User.hasMany(models.CallLog,   { foreignKey: 'userId' });
    User.hasMany(models.AuditLog,  { foreignKey: 'userId' });
  };

  return User;
};
