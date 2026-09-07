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

const ownsTransferQuery = (query: any, userId: number) => {
  const uid = Number(userId)
  const requestedUserId = query.userId != null ? Number(query.userId) : undefined
  const requestedTo = query.to != null ? Number(query.to) : undefined
  if (requestedUserId != null && requestedUserId !== uid) return null
  if (requestedTo != null && requestedTo !== uid) return null
  if (requestedUserId == null && requestedTo == null) {
    return { userId: uid }
  }
  return {
    ...(requestedUserId != null ? { userId: requestedUserId } : {}),
    ...(requestedTo != null ? { to: requestedTo } : {})
  }
}

export const searchTransfer = async (req: any, res: any) => {
  try {
    const scoped = ownsTransferQuery(req.query, req.user.id)
    if (!scoped) {
      res.send([])
      return
    }
    const data = await Transfer.transferSearch(scoped)
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
    if (!data) {
      res.status(404).send({ error: 'not_found' })
      return
    }
    const uid = Number(req.user.id)
    const ownerId = Number(data.userId ?? data.dataValues?.userId)
    const destinationId = Number(data.to ?? data.dataValues?.to)
    if (uid !== ownerId && uid !== destinationId) {
      res.status(403).send({ errors: ['Forbidden'] })
      return
    }
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('searchTransfer error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
