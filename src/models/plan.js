const { timestamp } = require('rxjs/operator/timestamp')

module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    'Plan',
    {
      plan: {
        type: DataTypes.ENUM,
        values: ['open source', 'private', 'with support'],
      },
      fee: DataTypes.DECIMAL,
      feePercentage: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      hook: {
        beforeCreate: async (instance, options) => {
          try {
            const percentages = { 'open source': 8, private: 18, 'with support': 30 }
            instance.feePercentage = percentages[instance.plan]
            instance.fee = (instance.amount * (percentages / 100)).toFixed(2)
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Saving Fee Percentage error', e)
          }
        },
      },
    },
  )

  Plan.associate = (models) => {
    Plan.belongsTo(models.Order, { foreignKey: 'OrderId' })
    Plan.belongsTo(models.PlanSchema, { foreignKey: 'PlanSchemaId' })
  }

  Plan.calcFinalPrice = (price, plan) => {
    const percentages = { 'open source': price >= 5000 ? 1 : 1.08, private: 1.18, full: 1.3 }
    return Math.round(Number((price * percentages[plan ? plan : 'open source']).toFixed(2)))
  }

  Plan.prototype.finalPrice = () => this.price + this.fee

  return Plan
}
