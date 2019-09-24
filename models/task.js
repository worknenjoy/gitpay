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
        Task.hasMany(models.History, { foreignKey: 'TaskId' })
        Task.hasMany(models.Order, { foreignKey: 'TaskId' })
        Task.hasMany(models.Assign, { foreignKey: 'TaskId' })
        Task.hasMany(models.Offer, { foreignKey: 'taskId' })
        Task.hasMany(models.Member, { foreignKey: 'taskId' })
      }
    },
    instanceMethods: {

    },
    hooks: {
      afterCreate: async (instance, options) => {
        // eslint-disable-next-line no-console
        console.log('afterCreate instance', instance)
        // eslint-disable-next-line no-console
        console.log('afterCreate', instance.changed())
        // eslint-disable-next-line no-console
        console.log('afterCreate previous dataValues', instance.previous())
        const changed = instance.changed()
        // eslint-disable-next-line no-console
        console.log('changed', changed)
        const taskHistory = await sequelize.models.History.create({
          TaskId: instance.id,
          type: 'create',
          fields: changed,
          oldValues: Object.values(instance.previous()),
          newValues: changed.map(v => instance.dataValues[v])
        })
        // eslint-disable-next-line no-console
        console.log('taskFeed', taskHistory)
      }
    }
  })

  return Task
}
