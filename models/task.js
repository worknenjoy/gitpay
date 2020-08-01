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
        Task.belongsToMany(models.Label, { foreignKey: 'taskId',
          otherKey: 'labelId',
          through: 'TaskLabels',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE' })
      }
    },
    instanceMethods: {

    },
    hooks: {
      afterCreate: async (instance, options) => {
        try {
          const changed = instance.changed()
          const taskHistory = await sequelize.models.History.create({
            TaskId: instance.id,
            type: 'create',
            fields: changed,
            oldValues: Object.values(instance.previous()),
            newValues: changed.map(v => instance.dataValues[v])
          })
          // eslint-disable-next-line no-console
          console.log('Task History create', taskHistory)
        }
        catch (e) {
          // eslint-disable-next-line no-console
          console.log('Task History update error', e)
        }
      },
      afterUpdate: async (instance, options) => {
        try {
          const changed = instance.changed()
          const previous = Object.values(instance.previous())
          const newValues = changed.map(v => `${instance.dataValues[v]}`)
          if ((JSON.stringify(previous) !== JSON.stringify(newValues)) &&
                (JSON.stringify(changed) !== JSON.stringify(['id', 'updatedAt']) &&
                (JSON.stringify(changed) !== JSON.stringify(['value', 'updatedAt']) && previous[0] !== 'null' && newValues[0] !== '0'))) {
            const taskHistory = await sequelize.models.History.create({
              TaskId: instance.id,
              type: 'update',
              fields: changed,
              oldValues: previous,
              newValues: newValues
            })
            // eslint-disable-next-line no-console
            console.log('Task History update success', taskHistory)
          }
        }
        catch (e) {
          // eslint-disable-next-line no-console
          console.log('Task History update error', e)
        }
      }
    }
  })

  return Task
}
