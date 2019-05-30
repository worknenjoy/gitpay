module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    provider: DataTypes.STRING,
    email: DataTypes.STRING,
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    repo: DataTypes.STRING,
    country: DataTypes.STRING,
    image: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    account_id: DataTypes.STRING,
    paypal_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Organization.belongsTo(models.User)
      }
    },
    instanceMethods: {

    }
  })
  return Organization
}
