const nanoId = require('nanoid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const couponValidity = new Date()
    couponValidity.setDate(couponValidity.getDate() + 5) // Adding five days for coupon validity

    return queryInterface.bulkInsert(
      'Coupons',
      [
        {
          code: nanoId.nanoid(10),
          amount: 100,
          expires: false,
          validUntil: couponValidity,
          times: 10
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Coupons', null, {})
  }
}
