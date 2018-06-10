const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);


module.exports = Promise.method(function userAccountCreate(userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then((user) => {
      if(user && user.dataValues && user.dataValues.account_id) {
        return { error: 'user already exist' };
      }
      if(!user && !user.dataValues && !user.dataValues.email) {
        return { error: 'Não foi possível registrar a conta' };
      }
      return stripe.accounts.create({
        type: 'custom',
        country: 'BR',
        email: user.dataValues.email
      }).then((account) => {
        return user.updateAttributes({
          account_id: account.id
        }).then((userUpdated) => {
          console.log('account for user created', account);
          return account;
        });
      })
    });
});
