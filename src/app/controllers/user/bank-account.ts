import {
  userBankAccountCreate,
  userBankAccountDelete,
  userBankAccountUpdate,
  userBankAccount as userBankAccountList
} from '../../../modules/users'

export const createBankAccount = async (req: any, res: any) => {
  try {
    const data = await userBankAccountCreate({
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
    const data = await userBankAccountUpdate({ userParams: req.user, bank_account: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const userBankAccount = async (req: any, res: any) => {
  try {
    const data = await userBankAccountList({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const deleteBankAccount = async (req: any, res: any) => {
  try {
    const data = await userBankAccountDelete({
      userParams: req.user,
      bankAccountId: req.params.id
    })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}
