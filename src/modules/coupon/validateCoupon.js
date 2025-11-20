const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function validateCoupon(payload) {
  return models.Coupon.findOne({ where: { code: payload.code } })
    .then((data) => {
      if (data) {
        if (data.dataValues.times === 0) {
          throw new Error('COUPON_MAX_TIMES_EXCEEDED')
        }

        const calculatedOrderPrice =
          payload.originalOrderPrice - payload.originalOrderPrice * (data.dataValues.amount / 100)

        return { ...data.dataValues, orderPrice: calculatedOrderPrice }
      }

      throw new Error('COUPON_DOES_NOT_EXISTS')
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
      throw err
    })
})
