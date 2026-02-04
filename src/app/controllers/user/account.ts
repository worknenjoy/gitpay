const user = require('../../../modules/users')

export const account = async (req: any, res: any) => {
  try {
    const data = await user.userAccount({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountCreate = async (req: any, res: any) => {
  req.body.id = req.user.id
  try {
    const data = await user.userAccountCreate(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountCountries = async (req: any, res: any) => {
  try {
    const data = await user.userAccountCountries({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountBalance = async (req: any, res: any) => {
  try {
    const data = await user.userAccountBalance({ account_id: req.user.account_id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountUpdate = async (req: any, res: any) => {
  try {
    const data = await user.userAccountUpdate({ userParams: req.user, accountParams: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account update', error)
    res.status(401).send(error)
  }
}

export const accountDelete = async (req: any, res: any) => {
  try {
    const data = await user.userAccountDelete({ userId: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account delete', error)
    res.status(401).send(error)
  }
}
