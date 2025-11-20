const Promise = require('bluebird')
const Sendmail = require('../mail/mail')
const models = require('../../models')

module.exports = Promise.method(async function userBuilds(userParameters) {
  const selectedTypeIds = userParameters.Types
  if (userParameters.password) {
    userParameters.password = models.User.generateHash(userParameters.password)
  }
  userParameters.activation_token = models.User.generateToken()
  if (userParameters.provider) {
    userParameters.email_verified = true
  } else {
    userParameters.email_verified = false
  }
  if (!userParameters.email && !userParameters.password && !userParameters.confirmPassword)
    return false
  try {
    const user = await models.User.build(userParameters).save()
    const { dataValues } = user
    if (dataValues && dataValues.id) {
      const { id, name, activation_token } = dataValues
      if (!userParameters.provider) {
        Sendmail.success(
          dataValues,
          'Activate your account',
          `<p>Hi ${name || 'Gitpay user'},</p><p>Click <a href="${process.env.FRONTEND_HOST}/#/activate/user/${id}/token/${activation_token}">here</a> to activate your account.</p>`
        )
      }
      if (selectedTypeIds && selectedTypeIds.length > 0) {
        await user.setTypes(selectedTypeIds)
        const userWithTypes = await models.User.findByPk(id, {
          include: { model: models.Type }
        })
        return userWithTypes
      }
    }
    return dataValues
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error from userBuilds', error)
    return false
  }
})
