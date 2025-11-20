module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    label: DataTypes.STRING,
  })

  return Role
}
