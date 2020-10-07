module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   allowNull: false
    // },
    name: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        UserRole.belongsTo(models.User, { foreignKey: 'userId' })
      }
    },
    instanceMethods: {

    }
  })

  return UserRole
}
