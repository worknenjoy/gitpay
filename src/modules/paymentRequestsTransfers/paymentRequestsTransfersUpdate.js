const models = require('../../models')

module.exports = async function paymentRequestTransferUpdate(paymentRequestTransferUpdateParams) {
  const { id, ...updateData } = paymentRequestTransferUpdateParams
  const transfer = await models.PaymentRequestTransfer.findByPk(id)
  if (!transfer) {
    throw new Error('Transfer not found')
  }
  await transfer.update(updateData, {
    returning: true
  })
  transfer.reload()
  return transfer
}
