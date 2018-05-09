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
      stripe.customers.create({
        email: orderParameters.email
      }).then(function (customer) {
        stripe.charges.create({
          amount: orderParameters.amount * 100,
          currency: orderParameters.currency,
          customer: customer,
          source: orderParameters.source_id,
          transfer_group: `task_${data.dataValues.TaskId}`,
          metadata: {order_id: data.dataValues.id}
        }).then(function(charge){
          console.log('charge created');
          console.log(charge);
          return charge;
        }).catch(function(err) {
          console.log('error to create charge');
          console.log(err);
          return err;
        });
      }).catch(function (err) {
        console.log('error to stripe account');
        console.log(err);
        return err;
      });
    }).catch(function (err) {
      console.log('error to stripe account');
      console.log(err);
      return err;
    });
});
