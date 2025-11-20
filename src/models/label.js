module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define(
    'Label',
    {
      name: DataTypes.STRING
    },
    {}
  )
  Label.associate = function (models) {
    Label.belongsToMany(models.Task, {
      alloqNull: false,
      foreignKey: 'labelId',
      otherKey: 'taskId',
      through: 'TaskLabels',
      onUpdate: 'cascade',
      onDelete: 'cascade',
      hooks: true
    })
  }

  return Label
}
