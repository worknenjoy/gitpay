const PaymentRequestTransfer = require('../../modules/paymentRequestsTransfers')

exports.createPaymentRequestTransfer = (req, res) => {
  PaymentRequestTransfer.paymentRequestsTransfersBuilds({
    userId: req.user.id,
    ...req.body,
  })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      console.error('Error creating payment request transfer:', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}

exports.listPaymentRequestTransfers = (req, res) => {
  PaymentRequestTransfer.paymentRequestsTransferList({
    userId: req.user.id,
  })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      console.error('Error listing payment request transfers:', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}

exports.updatePaymentRequestTransfer = (req, res) => {
  PaymentRequestTransfer.paymentRequestsTransferUpdate({
    userId: req.user.id,
    id: req.params.id,
    ...req.body,
  })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      console.error('Error updating payment request transfer:', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}
