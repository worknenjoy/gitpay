
const Promise = require('bluebird')
const WalletOrder = require('../../models').WalletOrder
const Wallet = require('../../models').Wallet
const User = require('../../models').User

module.exports = Promise.method(async function walletOrderBuilds(params) {
  const user = params.userId && await User.findOne({
    where: {
      id: params.userId
    }
  })

  if (!user) {
    return { error: 'No valid user' }
  }

  const walletOrder = await WalletOrder.create({
    userId: user.id,
    ...params
  })
  try {
    const currentWallet = await Wallet.findOne({
      where: {
        id: walletOrder.walletId
      }
    })
    const updateWallet = await Wallet.update({
      balance: currentWallet.balance + (walletOrder.status == 'succeeded' ? walletOrder.amount : 0)
    }, {
      where: {
        id: walletOrder.walletId
      },
      returning: true
    })
    if(updateWallet[1][0].dataValues) {
      return walletOrder
    } else {
      return { error: 'Error updating wallet' }
    }
  } catch (error) {
    console.log('error on walletOrderBuilds', error);
    return { error: 'Error updating wallet' }
  }
})