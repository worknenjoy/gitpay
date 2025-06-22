
module.exports = (sequelize, DataTypes) => {
  const PaymentRequest = sequelize.define('PaymentRequest', {
    currency: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    payment_link_id: DataTypes.STRING,
    payment_url: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    }
  })

  PaymentRequest.associate = (models) => {
    PaymentRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
  }

  return PaymentRequest
}
