const bcrypt = require('bcrypt')
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login_strategy: {
      type: DataTypes.STRING,
      defaultValue: 'local',
    },
    provider: DataTypes.STRING,
    provider_id: DataTypes.STRING,
    provider_username: DataTypes.STRING,
    provider_email: DataTypes.STRING,
    email: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    website: DataTypes.STRING,
    repos: DataTypes.STRING,
    language: DataTypes.STRING,
    country: DataTypes.STRING,
    profile_url: DataTypes.STRING,
    picture_url: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    account_id: DataTypes.STRING,
    paypal_id: DataTypes.STRING,
    os: DataTypes.STRING,
    skills: DataTypes.STRING,
    languages: DataTypes.STRING,
    recover_password_token: DataTypes.STRING,
    activation_token: DataTypes.STRING,
    receiveNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    openForJobs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  })

  User.associate = (models) => {
    User.hasMany(models.Organization)
    User.hasMany(models.Payout, { foreignKey: 'userId' })
    User.belongsToMany(models.Type, { through: 'User_Types' })
  }

  User.generateHash = (password) => {
    /* eslint-disable no-sync */
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  }

  User.generateToken = () => {
    return crypto.randomBytes(64).toString('hex')
  }

  User.prototype.verifyPassword = (password, databasePassword) => {
    return bcrypt.compareSync(password, databasePassword)
  }

  return User
}
