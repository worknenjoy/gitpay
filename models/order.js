module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    source_id: DataTypes.STRING,
    provider: DataTypes.STRING,
    currency: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    source_type: DataTypes.STRING,
    source: DataTypes.STRING,
    payment_url: DataTypes.STRING,
    payer_id: DataTypes.STRING,
    token: DataTypes.STRING,
    authorization_id: DataTypes.STRING,
    transfer_id: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    },
    capture: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ordered_in: DataTypes.DATE,
    destination: DataTypes.STRING,
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Order.belongsTo(models.User, { foreignKey: 'userId' })
        Order.belongsTo(models.Task, { foreignKey: 'TaskId' })
      }
    },
    instanceMethods: {

    }
  })

  return Order
}
