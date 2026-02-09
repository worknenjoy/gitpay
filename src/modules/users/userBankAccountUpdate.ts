import models from '../../models'
import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()

const currentModels = models as any

type UserBankAccountUpdateParams = {
  userParams: {
    id: number
  }
  bank_account: {
    id?: string
    account_holder_name: string
    account_holder_type: string
    default_for_currency?: boolean
  }
}

export async function userBankAccountUpdate({
  userParams,
  bank_account
}: UserBankAccountUpdateParams) {

  const {
    id,
    default_for_currency,
    account_holder_name,
    account_holder_type
  } = bank_account

  const data = await currentModels.User.findOne({
    where: { id: userParams.id }
  })

  if (data.dataValues.account_id) {
    const bankAccounts = await stripe.accounts.listExternalAccounts(data.dataValues.account_id, {
      object: 'bank_account'
    })

    if (bankAccounts.data.length) {
      const bankAccount =
        (id && bankAccounts.data.find((b: any) => b.id === id)) ||
        bankAccounts.data[0]
      const account = await stripe.accounts.updateExternalAccount(
        data.dataValues.account_id,
        bankAccount.id,
        {
          default_for_currency: default_for_currency,
          account_holder_name: account_holder_name,
          account_holder_type: account_holder_type
        }
      )
      return account
    }
  }
}
