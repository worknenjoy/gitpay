const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);

module.exports = Promise.method(function taskPayment(payment) {
  return models.Task
    .findOne({
      where: {
        id: payment.taskId
      }
    },
      {include: [models.User, models.Order, models.Assign]}
    )
    .then((data) => {
      models.User.findOne({
        where: {
            id: data.assigned
          }
      }).then((user) => {
        const transferGroup = `task_${data.id}`;
        const dest = user.account_id;
        if(!dest) {
          return Promise.reject('É necessário uma conta de destino');
        }
        /*stripe.balance.retrieve().then((balance) => {
          console.log('balance', balance);
          console.log('value', data.value * 100);
        });*/

        stripe.transfers.create({
          amount: (data.value * 100) * 0.92,
          currency: 'brl',
          destination: dest,
          source_type: 'card',
          transfer_group: transferGroup,
        }).then(function(transfer) {
          console.log('transfer');
          console.log(transfer);
          return transfer;
        }).catch((e) => {
          return Promise.reject(e.message);
        });
      }).catch((e) => {
        console.log(e);
        return Promise.reject(e.message);
      });

      //return { ...data, };
      return data;
    }).catch((error) => {
      console.log(error);
      return Promise.reject(e.message);
    });

});
