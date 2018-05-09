const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);

module.exports = Promise.method(function taskUpdate(taskParameters) {
  return models.Task
    .update(taskParameters, {
      where: {
        id: taskParameters.id,
      },
      include: [models.User, models.Order]
    }).then((data) => {
      return models.Task.findOne(
        {where: {id: taskParameters.id}, include: [models.User, models.Order]}
      ).then((task) => {
        if (taskParameters.Orders) {
          task.createOrder(taskParameters.Orders[0]).then((order) => {
            const orderParameters = taskParameters.Orders[0];
            stripe.customers.create({
              email: orderParameters.email
            }).then(function (customer) {
              stripe.customers.createSource(customer.id, {source: orderParameters.source_id}).then(function(card){
                stripe.charges.create({
                  amount: orderParameters.amount * 100,
                  currency: orderParameters.currency,
                  customer: customer.id,
                  source: card.id,
                  transfer_group: `task_${task.dataValues.id}`,
                  metadata: {order_id: order.dataValues.id}
                }).then(function(charge){
                  console.log('charge created');
                  console.log(charge);
                  return charge;
                }).catch(function(err) {
                  console.log('error to create charge');
                  console.log(err);
                  return err;
                });
              }).catch(function(err) {
                console.log('error creating source');
                console.log(err);
              })
            }).catch(function (err) {
              console.log('error to stripe account');
              console.log(err);
              return err;
            });
            //return task.dataValues;
          }).catch(error => console.log(error));
        }
        return task.dataValues;
      }).catch((error) => {
        console.log('error on task update find', error);
        return false;
      });

    }).catch((error) => {
      console.log('error on task update', error);
      return false;
    });
});
