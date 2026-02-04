const user = require('../../../modules/users')

export const customer = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const data = await user.userCustomer({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const customerCreate = async (req: any, res: any) => {
  try {
    const data = await user.userCustomerCreate(req.user.id, req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const customerUpdate = async (req: any, res: any) => {
  try {
    const data = await user.userCustomerUpdate(req.user.id, req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}
