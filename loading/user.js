const bcrypt = require('bcrypt-nodejs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    provider: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    website: DataTypes.STRING,
    repos: DataTypes.STRING,
    profile_url: DataTypes.STRING,
    picture_url: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    account_id: DataTypes.STRING,
    paypal_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {

      },
      generateHash: (password) => {
        /* eslint-disable no-sync */
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
      }
    },
    instanceMethods: {
      verifyPassword: (password, databasePassword) => {
        return bcrypt.compareSync(password, databasePassword)
      }
    }
  })
  return User
}
