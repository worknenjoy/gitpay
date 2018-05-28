const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);

module.exports = Promise.method(function orderBuilds(orderParameters) {
  return models.Order
    .build(
      orderParameters
    )
    .save()
    .then((data) => {
      return data;
    }).catch(function (err) {
      console.log('error to stripe account');
      console.log(err);
      return err;
    });
});
