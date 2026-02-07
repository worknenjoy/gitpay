import models from '../../models'
import stripeModule from '../../client/payment/stripe'
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

    return bankAccounts.data ?? []
  }

  return []
}
