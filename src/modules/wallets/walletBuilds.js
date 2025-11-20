const Promise = require('bluebird')
const Wallet = require('../../models').Wallet
const User = require('../../models').User

module.exports = Promise.method(async function walletBuilds(params) {
  const user =
    params.userId &&
    (await User.findOne({
      where: {
        id: params.userId,
      },
    }))

  if (!user) {
    return { error: 'No valid user' }
  }

  return Wallet.create({
    userId: user.id,
    name: params.name,
    balance: 0,
  })
})
