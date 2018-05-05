const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);

module.exports = Promise.method(function orderBuilds(orderParameters) {
  console.log('orderParameters');
  console.log(orderParameters);
  return models.Order
    .build(
      orderParameters
    )
    .save()
    .then((data) => {
      console.log('build a new order');
      console.log(data.dataValues);

      stripe.customers.create({
        email: orderParameters.email
      }).then(function (customer) {
        return stripe.customers.createSource(customer.id, {
          source: orderParameters.source_id
        });
      }).then(function (source) {
        return stripe.charges.create({
          amount: orderParameters.amount * 100,
          currency: orderParameters.currency,
          customer: source.customer,
          source: orderParameters.source_id,
          transfer_group: `task_${data.dataValues.TaskId}`,
        });
      }).then(function (charge) {
        console.log('charge created');
        console.log(charge);
        return charge
      }).catch(function (err) {
        console.log('error to stripe account');
        console.log(err);
        return err;
      });
      return data;

    }).catch((error) => {
      console.log('error to create order');
      console.log(error);
      return error;
    });

});
