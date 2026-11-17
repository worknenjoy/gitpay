import { paymentRequestTransferList } from '../../modules/paymentRequestsTransfers'

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
