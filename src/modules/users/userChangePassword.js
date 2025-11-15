const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function userChangePassword (userParameters) {
  const oldPassword = userParameters.old_password
  const newPassword = userParameters.password
  const minimumPasswordLength = 8
  const maximumPasswordLength = 20
  if (oldPassword.length < minimumPasswordLength) {
    throw new Error('user.password.current.incorrect.too_short')
  }

  if (oldPassword.length > maximumPasswordLength) {
    throw new Error('user.password.current.incorrect.too_long')
  }

  if (newPassword.length < minimumPasswordLength) {
    throw new Error('user.password.new.incorrect.too_short')
  }

  if (newPassword.length > maximumPasswordLength) {
    throw new Error('user.password.new.incorrect.too_long')
  }
  return models.User
    .findOne({ where: { id: userParameters.id } })
    .then(async foundUser => {
      if (!foundUser) {
        return false
      }

      const existingPassword = foundUser.dataValues.password

      if(oldPassword === newPassword) {
        throw new Error('user.password.incorrect.same')
      }

      const passwordIsValid = foundUser.verifyPassword(oldPassword, existingPassword)
      if (!passwordIsValid) {
        throw new Error('user.password.incorrect.current')
      }

      const passwordHash = models.User.generateHash(newPassword)
      if (passwordHash) {
        return models.User.update(
          { password: passwordHash },
          { where: { id: userParameters.id } }
        ).then(() => {
          return true
        }).catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          return false
        })
      }
    })
  
})
