const Promise = require('bluebird')
const Wallet = require('../../models').Wallet
const User = require('../../models').User

module.exports = Promise.method(async function walletUpdate(params) {
  const { amount, name, id } = params
  const user =
    params.userId &&
    (await User.findOne({
      where: {
        id: params.userId
      }
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  const wallet = await Wallet.update(
    {
      balance: amount,
      name: name
    },
    {
      where: {
        id: id
      },
      returning: true
    }
  )
  return wallet[1][0].dataValues
})
