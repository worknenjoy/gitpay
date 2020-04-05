const models = require('./models')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const scripts = {
  accountInfo: () => {
    models.User
      .findAll(
        {}
      )
      .then(users => {
        if (!users) return false

        if (users.length <= 0) return false

        const accountInfo = users.map(u => {
          if (!u.account_id) {
            return {
              user: u.email,
              active_account: false
            }
          }
          const accountDetails = stripe.accounts.retrieve(u.account_id).then(account => {
            return {
              user: u.email,
              active_account: true,
              account: account
            }
          })
          return accountDetails
        })
        // eslint-disable-next-line no-console
        console.log('users', accountInfo)
        return accountInfo
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('error when search user: ', error)
        return false
      })
  }
}

if (process.argv[2]) scripts[process.argv[2]]()
