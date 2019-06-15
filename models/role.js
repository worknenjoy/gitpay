module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    label: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {

      }
    },
    instanceMethods: {

    }
  })

  return Role
}
