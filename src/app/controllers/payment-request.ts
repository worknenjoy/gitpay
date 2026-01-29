import {
  paymentRequestBuilds,
  paymentRequestList,
  paymentRequestUpdate
} from '../../modules/paymentRequests'

export const createPaymentRequest = async function createPaymentRequest(req: any, res: any) {
  try {
    const data = await paymentRequestBuilds({ ...req.body, userId: req.user.id })
    res.status(201).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('createPaymentRequest error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const listPaymentRequests = async function listPaymentRequests(req: any, res: any) {
  try {
    const data = await paymentRequestList({ userId: req.user.id })
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('listPaymentRequests error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const updatePaymentRequest = async function updatePaymentRequest(req: any, res: any) {
  try {
    const data = await paymentRequestUpdate({
      id: req.params.id,
      ...req.body,
      userId: req.user.id
    })
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('updatePaymentRequest error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
