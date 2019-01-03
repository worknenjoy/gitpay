module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    value: DataTypes.DECIMAL,
    suggestedDate: DataTypes.DATE,
    comment: DataTypes.STRING,
    learn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Offer.belongsTo(models.User, { foreignKey: 'userId' })
        Offer.belongsTo(models.Task, { foreignKey: 'taskId' })
      }
    },
    instanceMethods: {
    }
  })
  return Offer
}
