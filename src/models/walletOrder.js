const Decimal = require('decimal.js')

module.exports = (sequelize, DataTypes) => {
  const WalletOrder = sequelize.define('WalletOrder', {
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    source_id: {
      type: DataTypes.STRING
    },
    currency: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    source_type: {
      type: DataTypes.STRING
    },
    source: {
      type: DataTypes.STRING,
      unique: true
    },
    capture: {
      type: DataTypes.BOOLEAN
    },
    ordered_in: {
      type: DataTypes.DATE
    },
    destination: {
      type: DataTypes.STRING
    },
    paid: {
      type: DataTypes.BOOLEAN
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'draft', 'open', 'paid', 'failed', 'uncollectible', 'void', 'refunded'],
      defaultValue: 'pending'
    }
  })

  WalletOrder.associate = function (models) {
    WalletOrder.belongsTo(models.Wallet, {
      foreignKey: 'walletId'
    })
  }

  return WalletOrder
}
