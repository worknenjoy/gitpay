const Decimal = require('decimal.js')

module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  })

  Wallet.associate = function (models) {
    Wallet.hasMany(models.WalletOrder, {
      foreignKey: 'walletId'
    })
    Wallet.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  Wallet.prototype.addBalance = async function () {
    const orders = await sequelize.models.WalletOrder.findAll({
      where: {
        walletId: this.id,
        status: 'paid'
      }
    })
    const balance = orders.reduce((acc, order) => {
      return acc.plus(order.amount)
    }, new Decimal(0))
    return balance
  }

  Wallet.prototype.spendBalance = async function () {
    const orders = await sequelize.models.Order.findAll({
      where: {
        provider: 'wallet',
        source_type: 'wallet-funds',
        source_id: `${this.id}`,
        status: 'succeeded'
      }
    })
    const balance = orders.reduce((acc, order) => {
      const fee = order.amount >= 5000 ? 1 : 1.08
      return acc.plus(order.amount * fee)
    }, new Decimal(0))
    return balance
  }

  Wallet.prototype.totalBalance = async function () {
    const totalAddedBalance = await this.addBalance()
    const addedBalance = new Decimal(totalAddedBalance)
    return addedBalance.minus(await this.spendBalance())
  }

  Wallet.addHook('afterFind', async (wallet, options) => {
    if (!wallet) return

    if (Array.isArray(wallet)) {
      // Handle findAll case
      for (const singleWallet of wallet) {
        await updateWalletBalance(singleWallet, options)
      }
    } else {
      // Handle findByPk or findOne case
      await updateWalletBalance(wallet, options)
    }
  })

  // Helper function to update the balance of a wallet
  async function updateWalletBalance(wallet, options) {
    const totalBalance = await wallet.totalBalance() // Calculate balance using your methods
    wallet.balance = totalBalance.toFixed(2) // Update the balance field in memory
    await wallet.save({
      transaction: options.transaction
    }) // Persist the updated balance to the database (optional)
  }

  return Wallet
}
