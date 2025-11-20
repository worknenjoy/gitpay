const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(function processCouponUsage(coupon) {
  // Coupom max times exceeded
  if (coupon.times === 0) {
    return false
  }

  // Coupon expired
  if (coupon.validUntil < new Date()) {
    return false
  }

  return models.Coupon.update({ times: coupon.times - 1 }, { where: { code: coupon.code } })
    .then((data) => {
      return true
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
      throw err
    })
})
