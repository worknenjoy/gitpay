const Promise = require('bluebird')
const Decimal = require('decimal.js')
const WalletOrder = require('../../models').WalletOrder
const Wallet = require('../../models').Wallet
const User = require('../../models').User

module.exports = Promise.method(async function walletOrderUpdate(params) {
  const { amount, name, id, userId } = params
  const user =
    params.userId &&
    (await User.findOne({
      where: {
        id: userId
      }
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  const wallet = await WalletOrder.update(params, {
    where: {
      id: id
    },
    returning: true,
    hooks: true, // Ensure hooks are enabled
    individualHooks: true
  })
  const updatedWalletOrder = wallet[1][0].dataValues

  return updatedWalletOrder
})
