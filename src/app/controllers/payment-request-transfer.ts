import {
  paymentRequestTransferList,
  paymentRequestTransferUpdate,
  paymentRequestTransferBuilds
} from '../../modules/paymentRequestsTransfers'

export const createPaymentRequestTransfer = async (req: any, res: any) => {
  await paymentRequestTransferBuilds({
    userId: req.user.id,
    ...req.body
  })
    .then((data: any) => {
      res.send(data)
    })
    .catch((error: any) => {
      console.error('Error creating payment request transfer:', error)
      res
        .status(error.StatusCodeError || 400)
        .json({ error: 'Error creating payment request transfer' })
    })
}

export const listPaymentRequestTransfers = async (req: any, res: any) => {
  await paymentRequestTransferList({
    userId: req.user.id
  })
    .then((data: any) => {
      res.send(data)
    })
    .catch((error: any) => {
      console.error('Error listing payment request transfers:', error)
      res
        .status(error.StatusCodeError || 400)
        .json({ error: 'Error listing payment request transfers' })
    })
}

export const updatePaymentRequestTransfer = async (req: any, res: any) => {
  await paymentRequestTransferUpdate({
    userId: req.user.id,
    id: req.params.id,
    ...req.body
  })
    .then((data: any) => {
      res.send(data)
    })
    .catch((error: any) => {
      console.error('Error updating payment request transfer:', error)
      res
        .status(error.StatusCodeError || 400)
        .json({ error: 'Error updating payment request transfer' })
    })
}
