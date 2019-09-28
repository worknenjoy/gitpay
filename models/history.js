module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    type: DataTypes.STRING,
    fields: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    oldValues: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    newValues: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    TaskId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tasks',
        key: 'id'
      },
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        History.belongsTo(models.Task)
      }
    }
  })

  return History
}
