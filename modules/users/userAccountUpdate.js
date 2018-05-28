const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);


module.exports = Promise.method(function userAccountUpdate(userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then((user) => {
      if(!user && !user.dataValues && !user.dataValues.account_id) {
        return { error: 'Você precisa criar sua conta antes atualizar os dados' };
      }
      if(!user && !user.dataValues && !user.dataValues.email) {
        return { error: 'Não foi possível registrar a conta' };
      }
      return stripe.accounts.update(user.dataValues.account_id, userParameters.account).then((account) => {
        return account;
      }).catch((e) => {
        console.log('could not finde customer', e);
        return e;
      });
    }).catch((error) => {
      console.log(error);
      return false;
    });

});
