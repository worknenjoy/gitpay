'use strict';

module.exports = (sequelize, DataTypes) => {
  const Assign = sequelize.define('Assign', {
    userId: {
      type: DataTypes.INTEGER,
      unique: true
    },
    TaskId: {
      type: DataTypes.INTEGER,
      unique: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Assign.belongsTo(models.User, { foreignKey: 'userId' });
        Assign.belongsTo(models.Task, { foreignKey: 'TaskId' });
      }
    },
    indexes: [
      {fields: ['userId', 'TaskId'], unique: true}
    ],
    instanceMethods: {

    }
  });
  return Assign;
};
