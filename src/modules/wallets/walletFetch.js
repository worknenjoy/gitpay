const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(async function walletFetch(params) {
  const user =
    params.userId &&
    (await models.User.findOne({
      where: {
        id: params.userId,
      },
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  const wallet = await models.Wallet.findOne({
    where: {
      id: params.id,
      userId: user.id,
    },
  })

  if (!wallet) {
    return { error: 'No valid wallet' }
  }

  return wallet.dataValues
})
