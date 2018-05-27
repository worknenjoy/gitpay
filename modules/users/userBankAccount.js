const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);


module.exports = Promise.method(function userBankAccount(userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then((data) => {
      if(data.dataValues.customer_id) {
        return stripe.customers.createSource(data.dataValues.customer_id, {
          source: {
            object: 'bank_account',
            country: 'BR',
            currency: 'BRL',
            account_holder_name: data.dataValues.name,
            account_holder_type: 'individual',
            routing_number: userParameters.routing_number,
            account_number: userParameters.account_number
          }
        }).then((account) => {
          console.log('bank account');
          console.log(account);
          return account;
        }).catch((e) => {
          console.log('could not finde customer', e);
          return e;
        });
      }
      return false;
    }).catch((error) => {
      console.log(error);
      return false;
    });

});
