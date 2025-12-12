module.exports = (sequelize, DataTypes) => {
  const Payout = sequelize.define('Payout', {
    source_id: DataTypes.STRING,
    method: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'usd'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'initiated'
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    arrival_date: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })

  Payout.associate = (models) => {
    Payout.belongsTo(models.User, { foreignKey: 'userId' })
  }

  return Payout
}
