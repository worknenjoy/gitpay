module.exports = (sequelize, DataTypes) => {
  const PaymentRequestTransfer = sequelize.define(
    'PaymentRequestTransfer',
    {
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      value: DataTypes.DECIMAL,
      transfer_id: DataTypes.STRING,
      transfer_method: DataTypes.STRING,
      paymentRequestId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'PaymentRequests',
          key: 'id'
        },
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      }
    },
    {}
  )

  PaymentRequestTransfer.associate = function (models) {
    PaymentRequestTransfer.belongsTo(models.PaymentRequest, {
      foreignKey: 'paymentRequestId'
    })
    PaymentRequestTransfer.belongsTo(models.User, {
      foreignKey: 'userId'
    })
  }

  return PaymentRequestTransfer
}
