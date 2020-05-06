module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define('Label', {
    name: DataTypes.STRING
  }, {})
  Label.associate = function (models) {
    Label.belongsToMany(models.Task, {
      foreignKey: 'labelId',
      otherKey: 'taskId',
      through: 'TaskLabels',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  }
  return Label
}
