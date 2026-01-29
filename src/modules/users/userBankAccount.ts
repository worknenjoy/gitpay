import models from '../../models'
import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserBankAccountParams = {
  id: number
}

export async function userBankAccount(userParameters: UserBankAccountParams) {
  const data = await currentModels.User.findOne({
    where: { id: userParameters.id }
  })

  if (data.dataValues.account_id) {
    const bankAccounts = await stripe.accounts.listExternalAccounts(data.dataValues.account_id, {
      object: 'bank_account'
    })

    if (bankAccounts.data.length) {
      return bankAccounts.data[0]
    }
    return false
  }
}
