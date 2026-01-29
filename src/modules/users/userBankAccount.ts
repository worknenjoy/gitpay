import models from '../../models'
const stripe = require('../shared/stripe/stripe')()

const currentModels = models as any

type UserBankAccountParams = {
  id: number
}

export async function userBankAccount(userParameters: UserBankAccountParams) {
  try {
    const data = await currentModels.User.findOne({
      where: { id: userParameters.id }
    })
    
    if (data.dataValues.account_id) {
      const bankAccounts = await stripe.accounts.listExternalAccounts(
        data.dataValues.account_id,
        { object: 'bank_account' }
      )
      
      if (bankAccounts.data.length) {
        return bankAccounts.data[0]
      }
      return false
    }
  } catch (error) {
    throw error
  }
}
