module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Member.belongsTo(models.User, { foreignKey: 'userId' })
        Member.belongsTo(models.Task, { foreignKey: 'taskId' })
        Member.belongsTo(models.Role, { foreignKey: 'roleId' })
      }
    },
    instanceMethods: {

    }
  })

  return Member
}
