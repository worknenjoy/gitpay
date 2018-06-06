'use strict';

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    provider: DataTypes.STRING,
    type: DataTypes.STRING,
    level: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'OPEN'
    },
    deadline: DataTypes.DATE,
    url: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    assigned:  {
      type: DataTypes.INTEGER,
      references: {
        model: 'Assigns',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Task.belongsTo(models.User, { foreignKey: 'userId' });
        Task.hasMany(models.Order, { foreignKey: 'TaskId'});
        Task.hasMany(models.Assign, { foreignKey: 'TaskId'});
      }
    },
    instanceMethods: {

    }
  });
  return Task;
};
