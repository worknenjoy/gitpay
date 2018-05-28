const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);


module.exports = Promise.method(function userAccount(userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then((data) => {
      if(data && data.dataValues && data.dataValues.account_id) {
        return stripe.accounts.retrieve(data.dataValues.account_id).then((account) => {
          return account;
        }).catch((e) => {
          console.log('could not find customer', e);
          return e;
        });
      }
      return {};
    }).catch((error) => {
      console.log(error);
      return false;
    });

});
