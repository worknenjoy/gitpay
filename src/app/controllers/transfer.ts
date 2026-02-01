import * as Transfer from '../../modules/transfers'

export const createTransfer = async (req: any, res: any) => {
  try {
    const data = await Transfer.transferBuilds(req.body)
    res.send(data)
  } catch (error: any) {
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const updateTransfer = async (req: any, res: any) => {
  try {
    const data = await Transfer.transferUpdate(req.body)
    res.send(data)
  } catch (error: any) {
    console.log('error', error)
    res.status(error.StatusCode || 400).send(error)
  }
}

export const searchTransfer = async (req: any, res: any) => {
  try {
    const data = await Transfer.transferSearch(req.query)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('searchTransfer error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

export const fetchTransfer = async (req: any, res: any) => {
  try {
    const data = await Transfer.transferFetch(req.params.id)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('searchTransfer error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
