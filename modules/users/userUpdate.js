const bcrypt = require('bcrypt-nodejs')
const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function userUpdate (userParameters) {
  let condition = {}
  if (userParameters.id) {
    condition = {
      where: {
        id: userParameters.id
      }
    }
  }
  else {
    condition = {
      where: {
        email: userParameters.email
      }
    }
  }
  // eslint-disable-next-line no-sync
  userParameters.password = bcrypt.hashSync(userParameters.password, bcrypt.genSaltSync(8), null)
  return models.User
    .update(userParameters, { ...condition, returning: true, plain: true }).then(data => {
      // eslint-disable-next-line no-console
      // console.log(data)
      return data[1].dataValues
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      return false
    })
})
