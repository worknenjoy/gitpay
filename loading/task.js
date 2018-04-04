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
    stack: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    dod: DataTypes.STRING,
    deadline: DataTypes.DATE,
    url: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    assign: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Task.belongsTo(models.User, { foreignKey: 'userId' });
      }
    },
    instanceMethods: {

    }
  });
  return Task;
};
