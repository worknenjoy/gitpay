module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Role.belongsTo(models.User, { foreignKey: 'userId' })
      }
    },
    instanceMethods: {

    }
  })

  return Role
}
