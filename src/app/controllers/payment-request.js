const PaymentRequests = require('../../modules/paymentRequests')

exports.createPaymentRequest = async function createPaymentRequest(req, res) {
  try {
    const data = await PaymentRequests.paymentRequestBuilds({ ...req.body, userId: req.user.id })
    res.status(201).send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('createPaymentRequest error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

exports.listPaymentRequests = async function listPaymentRequests(req, res) {
  try {
    const data = await PaymentRequests.paymentRequestList({ userId: req.user.id })
    res.status(200).send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('listPaymentRequests error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

exports.updatePaymentRequest = async function updatePaymentRequest(req, res) {
  try {
    const data = await PaymentRequests.paymentRequestUpdate({
      id: req.params.id,
      ...req.body,
      userId: req.user.id
    })
    res.status(200).send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('updatePaymentRequest error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
