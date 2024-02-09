const Promise = require('bluebird')
const Sendmail = require('../mail/mail')
const models = require('../../models')

module.exports = Promise.method(function userBuilds (userParameters) {
  if(userParameters.password !== userParameters.confirmPassword) return false
  if(userParameters.password) {
    userParameters.password = models.User.generateHash(userParameters.password)
  }
  userParameters.activation_token = models.User.generateToken()
  if(userParameters.provider) {
    userParameters.email_verified = true
  } else {
    userParameters.email_verified = false
  }
  if (!userParameters.email && !userParameters.password && !userParameters.confirmPassword) return false
  return models.User.build(
    userParameters
  )
    .save()
    .then(data => {
      if (data && data.dataValues && data.dataValues.id) {
        const { id, name, activation_token } = data.dataValues
        if(!userParameters.provider) {
          Sendmail.success(data.dataValues, 'Activate your account', `<p>Hi ${name || 'Gitpay user'},</p><p>Click <a href="${process.env.FRONTEND_HOST}/#/activate/user/${id}/token/${activation_token}">here</a> to activate your account.</p>`)
        }
      }
      return data
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error from userBuilds', error)
      return false
    })
})
