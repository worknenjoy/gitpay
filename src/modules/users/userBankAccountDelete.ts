import models from '../../models'
import stripeModule from '../../client/payment/stripe'

const stripe = stripeModule()
const currentModels = models as any

type UserBankAccountDeleteParams = {
  userParams: {
    id: number
  }
  bankAccountId: string
}

export async function userBankAccountDelete({ userParams, bankAccountId }: UserBankAccountDeleteParams) {
  const data = await currentModels.User.findOne({
    where: { id: userParams.id }
  })

  if (!data?.dataValues?.account_id) return null

  const deleted = await stripe.accounts.deleteExternalAccount(data.dataValues.account_id, bankAccountId)
  return deleted
}
