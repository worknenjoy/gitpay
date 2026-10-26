import {
  paymentRequestTransferList,
  paymentRequestTransferUpdate,
  paymentRequestTransferBuilds
} from '../../modules/paymentRequestsTransfers'

export const createPaymentRequestTransfer = async (req: any, res: any) => {
  const { paymentRequestId, value, transfer_id, transfer_method, status } =
    req.body || {}
  await paymentRequestTransferBuilds({
    paymentRequestId,
    value,
    transfer_id,
    transfer_method,
    status,
    userId: req.user.id
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
  const { transfer_method, status, value, transfer_id } = req.body || {}
  await paymentRequestTransferUpdate({
    id: req.params.id,
    transfer_method,
    status,
    value,
    transfer_id,
    userId: req.user.id
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

