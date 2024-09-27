
const Promise = require('bluebird')
const Decimal = require('decimal.js');
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
  if(walletOrder.status === 'succeeded') {
    try {
      const currentWallet = await Wallet.findOne({
        where: {
          id: walletOrder.walletId
        }
      })
      const currentBalance = new Decimal(currentWallet.balance);
      const updatedBalance = currentBalance.plus(new Decimal(walletOrder.amount));
      
      const updateWallet = await Wallet.update({
        balance: updatedBalance
      }, {
        where: {
          id: walletOrder.walletId
        },
        returning: true
      })
      const updatedWalletValues = updateWallet[1][0].dataValues
      if(updatedWalletValues) {
        return walletOrder
      } else {
        return { error: 'Error updating wallet' }
      }
    } catch (error) {
      console.log('error on walletOrderBuilds', error);
      return { error: 'Error updating wallet' }
    }
  }
  return walletOrder
})