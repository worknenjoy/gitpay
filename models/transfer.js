module.exports = (sequelize, DataTypes) => {
  const Transfer = sequelize.define('Transfer', {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    value: DataTypes.DECIMAL,
    transfer_id: DataTypes.STRING,
    transfer_method: DataTypes.STRING,
    taskId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tasks',
        key: 'id'
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
    },
    to: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
    }
  }, {

  })

  Transfer.associate = function (models) {
    Transfer.belongsTo(models.Task, {
      foreignKey: 'taskId'
    })
    Transfer.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  return Transfer
}