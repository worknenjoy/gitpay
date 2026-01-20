module.exports = (sequelize, DataTypes) => {
  const PlanSchema = sequelize.define('PlanSchema', {
    plan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    fee: DataTypes.DECIMAL,
    feeType: DataTypes.ENUM('charge', 'refund')
  })

  return PlanSchema
}
