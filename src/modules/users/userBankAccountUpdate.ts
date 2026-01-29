import models from '../../models'
import stripeModule from '../shared/stripe/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserBankAccountUpdateParams = {
  userParams: {
    id: number
  }
  bank_account: {
    account_holder_name: string
    account_holder_type: string
  }
}

export async function userBankAccountUpdate({
  userParams,
  bank_account
}: UserBankAccountUpdateParams) {
  const data = await currentModels.User.findOne({
    where: { id: userParams.id }
  })

  if (data.dataValues.account_id) {
    const bankAccounts = await stripe.accounts.listExternalAccounts(data.dataValues.account_id, {
      object: 'bank_account'
    })

    if (bankAccounts.data.length) {
      const bankAccount = bankAccounts.data[0]
      const account = await stripe.accounts.updateExternalAccount(
        data.dataValues.account_id,
        bankAccount.id,
        {
          account_holder_name: bank_account.account_holder_name,
          account_holder_type: bank_account.account_holder_type
        }
      )
      return account
    }
  }
}
