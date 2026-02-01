import * as Payout from '../../modules/payouts'

export async function createPayout(req: any, res: any) {
  try {
    const data = await Payout.payoutBuilds({ ...req.body, userId: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('createPayout error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const requestPayout = async (req: any, res: any) => {
  try {
    const data = await Payout.payoutRequest({ ...req.body, userId: req.user.id })
    if (data.error) {
      return res.status(400).send(data)
    }
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('requestPayout error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const searchPayout = async (req: any, res: any) => {
  try {
    const data = await Payout.payoutSearch({ ...req.query, userId: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('searchTransfer error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
