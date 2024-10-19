const Promise = require('bluebird')
const models = require('../../models')
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_KEY)

module.exports = Promise.method(function userBankAccountUpdate(userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then(data => {
      if (data.dataValues.account_id) {
        return stripe.accounts.listExternalAccounts(data.dataValues.account_id, { object: 'bank_account' }).then((bankAccounts) => {
          if (bankAccounts.data.length) {
            const bankAccount = bankAccounts.data[0]
            return stripe.accounts.updateExternalAccount(
              data.dataValues.account_id,
              bankAccount.id,
              {  
                account_holder_name: userParameters.account_holder_name,
                account_holder_type: userParameters.account_holder_type,
              }).then(account => {
                return account
              })
          }
        })
      }
    })
})
