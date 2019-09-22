module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    provider: DataTypes.STRING,
    type: DataTypes.STRING,
    level: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    },
    deadline: DataTypes.DATE,
    url: DataTypes.STRING,
    title: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    transfer_id: DataTypes.STRING,
    assigned: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Assigns',
        key: 'id'
      },
      allowNull: true,
    }
  }, {
    classMethods: {
      associate: (models) => {
        Task.belongsTo(models.User, { foreignKey: 'userId' })
        Task.hasMany(models.Order, { foreignKey: 'TaskId', onDelete: 'cascade', hooks: true })
        Task.hasMany(models.Assign, { foreignKey: 'TaskId', onDelete: 'cascade', hooks: true })
        Task.hasMany(models.Offer, { foreignKey: 'taskId', onDelete: 'cascade', hooks: true })
        Task.hasMany(models.Member, { foreignKey: 'taskId', onDelete: 'cascade', hooks: true })
      }
    },
    instanceMethods: {

    }
  })

  return Task
}
