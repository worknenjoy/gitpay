const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(async function transferBuilds(params) {
  const paymentRequestTransfer = await models.PaymentRequestTransfer.create(params)
  return paymentRequestTransfer
})
