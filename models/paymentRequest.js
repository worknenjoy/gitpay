
module.exports = (sequelize, DataTypes) => {
  const PaymentRequest = sequelize.define('PaymentRequest', {
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    currency: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    payment_link_id: DataTypes.STRING,
    payment_url: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    },
    transfer_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending_payment'
    },
    transfer_id: DataTypes.STRING
  })

  PaymentRequest.associate = (models) => {
    PaymentRequest.belongsTo(models.User, { foreignKey: 'userId' })
  }

  return PaymentRequest
}
