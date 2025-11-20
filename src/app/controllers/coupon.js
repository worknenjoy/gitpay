const couponValidate = require('../../modules/coupon').validateCoupon

exports.validateCoupon = (req, res) => {
  couponValidate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(400).send({ error: error.message })
    })
}
