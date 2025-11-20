const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(async function walletList(params) {
  const user =
    params.userId &&
    (await models.User.findOne({
      where: {
        id: params.userId
      }
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  return models.Wallet.findAll({
    where: {
      userId: user.id
    },
    hooks: true,
    individualHooks: true
  })
})
