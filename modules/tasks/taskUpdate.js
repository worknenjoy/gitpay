const Promise = require('bluebird');
const models = require('../../loading/loading');
const { userExist, userBuild, userUpdate } = require('../../modules/users');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);

const createSourceAndCharge = (customer, orderParameters, order, task) => {
   stripe.customers.createSource(customer.id, {source: orderParameters.source_id}).then(function(card){
     stripe.charges.create({
      amount: orderParameters.amount * 100,
      currency: orderParameters.currency,
      customer: customer.id,
      source: card.id,
      transfer_group: `task_${task.dataValues.id}`,
      metadata: {order_id: order.dataValues.id}
    }).then(function(charge){
      order.updateAttributes({
        source: charge.id,
        source_id: card.id,
        paid: charge.paid,
        status: charge.status
      }).then(function(updatedUser) {
        return charge;
      }).catch((err) => {
        console.log('error to update attributes');
        console.log(err);
        return err;
      });
    }).catch(function(err) {
      console.log('error to create charge');
      console.log(err);
      return err;
    });
  }).catch(function(err) {
    console.log('error creating source');
    console.log(err);
    return err;
  })
};

const createCustomer = (orderParameters, order, task) => {
  stripe.customers.create({
    email: orderParameters.email
  }).then(function (customer) {
    if (order.userId) {
      return models.User.update({customer_id: customer.id}, {where: {id: order.userId}}).then((update) => {
        if (update[0]) {
          createSourceAndCharge(customer, orderParameters, order, task);
        }
      });
    }
    createSourceAndCharge(customer, orderParameters, order, task);
  }).catch(function (err) {
    console.log('error to stripe account');
    console.log(err);
    return err;
  });
}

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
            if(order.userId) {
              models.User.findById(order.userId).then((user) => {
                if(user && user.dataValues.customer_id) {
                  stripe.customers.retrieve(user.customer_id).then((customer) => {
                    return createSourceAndCharge(customer, orderParameters, order, task);
                  }).catch((e) => {
                    console.log('could not finde customer', e);
                    return e;
                  });
                } else {
                  return createCustomer(orderParameters, order, task);
                }
              });
            } else {
              return createCustomer(orderParameters, order, task);
            }
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
