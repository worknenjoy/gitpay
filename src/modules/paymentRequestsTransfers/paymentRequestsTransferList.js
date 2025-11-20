const models = require('../../models')

module.exports = async function paymentRequestTransferList(paymentRequestTransferParams) {
  const paymentRequestTransferList = await models.PaymentRequestTransfer.findAll({
    where: {
      userId: paymentRequestTransferParams.userId
    },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: models.User
      },
      {
        model: models.PaymentRequest
      }
    ]
  })
  return paymentRequestTransferList
}
