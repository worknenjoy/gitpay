const AssignMail = require('../mail/assign');
const PaymentMail = require('../mail/payment');
const SendMail = require('../mail/mail');
const Promise = require('bluebird');
const models = require('../../loading/loading');
const { userExist, userBuild, userUpdate } = require('../../modules/users');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);

const createSourceAndCharge = (customer, orderParameters, order, task, user) => {

   return stripe.customers.createSource(customer.id, {source: orderParameters.source_id}).then(function(card){
     stripe.charges.create({
      amount: orderParameters.amount * 100,
      currency: orderParameters.currency,
      customer: customer.id,
      source: card.id,
      transfer_group: `task_${task.dataValues.id}`,
      metadata: {order_id: order.dataValues.id}
    }).then(function(charge){
      if(charge) {
        return order.updateAttributes({
          source: charge.id,
          source_id: card.id,
          paid: charge.paid,
          status: charge.status
        }).then(function(updatedUser) {
          PaymentMail.success(user.email, task, order.amount);
         return charge;
        }).catch((err) => {
          console.log('error to update attributes');
          console.log(err);
          PaymentMail.error(user.email, task, order.amount);
          return err;
        });
      }
      PaymentMail.error(user.email, task, order.amount);

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

const createCustomer = (orderParameters, order, task, user) => {
  stripe.customers.create({
    email: orderParameters.email
  }).then(function (customer) {
    if (order.userId) {
      return models.User.update({customer_id: customer.id}, {where: {id: order.userId}}).then((update) => {
        if (update[0]) {
          createSourceAndCharge(customer, orderParameters, order, task, user);
        }
      });
    }
    createSourceAndCharge(customer, orderParameters, order, task, user);
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
        {where: {id: taskParameters.id}, include: [models.User, models.Order, models.Assign]}
      ).then((task) => {
        if (task && taskParameters.Orders) {
          task.createOrder(taskParameters.Orders[0]).then((order) => {
            const orderParameters = taskParameters.Orders[0];
            if(order.userId) {
              models.User.findById(order.userId).then((user) => {
                if(user && user.dataValues.customer_id) {
                  stripe.customers.retrieve(user.customer_id).then((customer) => {
                    return createSourceAndCharge(customer, orderParameters, order, task, user.dataValues);
                  }).catch((e) => {
                    console.log('could not finde customer', e);
                    return e;
                  });
                } else {
                  return createCustomer(orderParameters, order, task, user.dataValues);
                }
              });
            } else {
              return createCustomer(orderParameters, order, task, user.dataValues);
            }
          }).catch(error => console.log(error));

        }
        if (task && taskParameters.Assigns) {
          task.createAssign(taskParameters.Assigns[0]).then((assign) => {
            if(assign) {
              models.User.findOne(
                {where: {id: assign.dataValues.userId}}
              ).then((user) => {
                const usermail = task.dataValues.User.dataValues.email;
                if (!usermail) {
                  return AssignMail.error('Alguém registrou interesse mas não recebeu o email da tarefa' + task.dataValues);
                }
                AssignMail.success(usermail, task.dataValues, user.name);
                return assign;
              }).catch((e) => console.log(e));
            }
          }).catch(error => console.log(error));
        }
        if(task && taskParameters.assigned) {
          models.Assign.findOne({
            where: {
              id: taskParameters.assigned
            },
            include: [models.User]
          }).then((assigned) => {
            SendMail.success(assigned.dataValues.User.dataValues.email, 'Você foi escolhido para iniciar uma tarefa no Gitpay', `
                      <p>Você foi escolhido para começar com a tarefa <a href="${process.env.FRONTEND_HOST}/#/task/${task.dataValues.id}">${process.env.FRONTEND_HOST}/#/task/${task.dataValues.id}</a> no Gitpay</p>
                      <p>Isto quer dizer que você já pode começar. Fique de olho no prazo para conclusão, e após a tarefa for finalizada você receberá o pagamento na sua conta cadastrada.</p>
              `);
          });
        }
        return task ? task.dataValues : {};
      }).catch((error) => {
        console.log('error on task update find', error);
        return false;
      });
    }).catch((error) => {
      console.log('error on task update', error);
      return false;
    });
});
