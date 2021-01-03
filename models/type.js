module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        
      }
    },
    instanceMethods: {

    }
  })

  return Type
}
