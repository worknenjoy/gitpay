const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(async function walletListOrder(params) {
  const wallet =
    params.walletId &&
    (await models.Wallet.findOne({
      where: {
        id: params.walletId
      }
    }))

  if (!wallet) {
    return { error: 'No valid wallet' }
  }

  return models.WalletOrder.findAll({
    where: {
      walletId: wallet.id
    },
    order: [['id', 'DESC']]
  })
})
