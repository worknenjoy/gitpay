module.exports = (sequelize, DataTypes) => {
  const Assign = sequelize.define('Assign', {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    message: {
      type: DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: (models) => {
        Assign.belongsTo(models.User, { foreignKey: 'userId' })
        Assign.belongsTo(models.Task, { foreignKey: 'TaskId' })
      }
    },
    instanceMethods: {

    }
  })
  return Assign
}
