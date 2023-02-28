module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    description: DataTypes.STRING
  })

  Type.associate = (models) => {
    Type.belongsToMany(models.User, { through: 'User_Types' })
  }

  return Type
}
