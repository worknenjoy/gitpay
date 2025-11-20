const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(async function userExists(userAttributes) {
  const conditions = {}
  if (userAttributes.id) {
    conditions.id = userAttributes.id
  }
  if (userAttributes.email) {
    conditions.email = userAttributes.email
  }
  try {
    const user = await models.User.findOne({
      where: {
        ...conditions
      },
      include: [
        models.Type,
        {
          model: models.Organization,
          include: [
            {
              model: models.Project,
              include: [models.Task]
            }
          ]
        }
      ]
    })
    if (!user) return false

    if (user && !user.dataValues) return false

    if (user.length <= 0) return false
    /* return {
      id: user.dataValues.id,
      website: user.dataValues.website,
      profile_url: user.dataValues.profile_url,
      picture_url: user.dataValues.picture_url,
      name: user.dataValues.name,
      username: user.dataValues.username,
      email: user.dataValues.email,
      provider: user.dataValues.provider,
      account_id: user.dataValues.account_id,
      paypal_id: user.dataValues.paypal_id,
      repos: user.dataValues.repos,
      verifyPassword: user.verifyPassword,
      createdAt: user.dataValues.createdAt,
      updatedAt: user.dataValues.updatedAt
    } */

    return user
  } catch (error) {
    console.log('userExists error', error)
  }
})
