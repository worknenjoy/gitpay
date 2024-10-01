const Promise = require('bluebird')
const Decimal = require('decimal.js')
const WalletOrder = require('../../models').WalletOrder
const Wallet = require('../../models').Wallet
const User = require('../../models').User

module.exports = Promise.method(async function walletOrderUpdate(params) {
  const { amount, name, id, userId } = params
  const user = params.userId && await User.findOne({
    where: {
      id: userId
    }
  })

  if (!user) {
    return { error: 'No valid user' }
  }

  const wallet = await WalletOrder.update(params, {
    where: {
      id: id
    },
    returning: true
  })
  const updatedWalletOrder = wallet[1][0].dataValues

  if(updatedWalletOrder.status === 'paid') {
    try {
      const currentWallet = await Wallet.findOne({
        where: {
          id: updatedWalletOrder.walletId
        }
      })
      const currentBalance = new Decimal(currentWallet.balance);
      const updatedBalance = currentBalance.plus(new Decimal(updatedWalletOrder.amount));
      
      const updateWallet = await Wallet.update({
        balance: updatedBalance
      }, {
        where: {
          id: updatedWalletOrder.walletId
        },
        returning: true
      })
      const updatedWalletValues = updateWallet[1][0].dataValues
      if(updatedWalletValues) {
        return updatedWalletOrder
      } else {
        return { error: 'Error updating wallet' }
      }
    } catch (error) {
      console.log('error on walletOrderUpdate', error);
      return { error: 'Error updating wallet' }
    }
  }

  return updatedWalletOrder
})