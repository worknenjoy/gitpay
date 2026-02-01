import models from '../../models'
import stripeModule from '../../client/payment/stripe'
const stripe = stripeModule()
import { currencyMap } from '../util/currency-map'

const currentModels = models as any

const getCurrency = (country: string) => {
  return currencyMap[country]
}

type UserBankAccountCreateParams = {
  userParams: {
    id: number
    country: string
    currency?: string
  }
  bankAccountParams: {
    country?: string
    currency?: string
    account_holder_type: string
    account_holder_name: string
    routing_number: string
    account_number: string
  }
}

export async function userBankAccountCreate({
  userParams,
  bankAccountParams
}: UserBankAccountCreateParams) {
  const userCountry = userParams.country
  const userCurrency = userParams.currency || getCurrency(userCountry)

  const data = await currentModels.User.findOne({
    where: { id: userParams.id }
  })

  if (data.dataValues.account_id) {
    const bankAccounts = await stripe.accounts.listExternalAccounts(data.dataValues.account_id, {
      object: 'bank_account'
    })

    if (bankAccounts.data.length) {
      return bankAccounts.data[0]
    }

    const account = await stripe.accounts.createExternalAccount(data.dataValues.account_id, {
      external_account: {
        object: 'bank_account',
        country: bankAccountParams.country || userCountry,
        currency: bankAccountParams.currency || userCurrency,
        account_holder_type: bankAccountParams.account_holder_type,
        account_holder_name: bankAccountParams.account_holder_name,
        routing_number: bankAccountParams.routing_number,
        account_number: bankAccountParams.account_number
      }
    })

    return account
  }
}
