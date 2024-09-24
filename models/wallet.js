
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

  return Wallet
}
