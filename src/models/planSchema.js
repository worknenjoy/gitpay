module.exports = (sequelize, DataTypes) => {
  const PlanSchema = sequelize.define('PlanSchema', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    fee: DataTypes.DECIMAL,
    feeType: DataTypes.ENUM('charge', 'refund')
  })

  return PlanSchema
}
