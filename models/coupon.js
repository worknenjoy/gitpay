module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    code: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.DECIMAL
    },
    expires: {
      type: DataTypes.BOOLEAN
    },
    validUntil: {
      type: DataTypes.DATE
    },
    times: {
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      associate: (models) => {
        Coupon.hasMany(models.Order, { foreignKey: 'couponId' })
      }
    }
  })
  return Coupon
}
