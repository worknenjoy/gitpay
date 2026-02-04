const user = require('../../../modules/users')

export const createBankAccount = async (req: any, res: any) => {
  try {
    const data = await user.userBankAccountCreate({
      userParams: req.user,
      bankAccountParams: req.body
    })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const updateBankAccount = async (req: any, res: any) => {
  try {
    const data = await user.userBankAccountUpdate({ userParams: req.user, bank_account: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const userBankAccount = async (req: any, res: any) => {
  try {
    const data = await user.userBankAccount({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}
