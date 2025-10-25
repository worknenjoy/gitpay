module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    value: DataTypes.DECIMAL,
    suggestedDate: DataTypes.DATE,
    comment: DataTypes.STRING(1000),
    learn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  })

  Offer.associate = (models) => {
    Offer.belongsTo(models.User, { foreignKey: 'userId' })
    Offer.belongsTo(models.Task, { foreignKey: 'taskId' })
  }

  return Offer
}
