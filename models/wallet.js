const Decimal = require('decimal.js');

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

  Wallet.addHook('afterFind', async (wallets, options) => {
    if (!wallets) return;

    const updateBalance = async (wallet) => {
      const walletOrders = await wallet.getWalletOrders({
        where: { status: 'paid' }
      });

      const totalBalance = walletOrders.reduce((sum, order) => {
        return sum + parseFloat(order.amount);
      }, 0);

      wallet.balance = new Decimal(totalBalance).toFixed(2);
    };

    if (Array.isArray(wallets)) {
      await Promise.all(wallets.map(updateBalance));
    } else {
      await updateBalance(wallets);
    }
  });

  return Wallet
}
