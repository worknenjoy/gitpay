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
      if(!data) {
        throw new Error('find_task_error');
      }
       return models.User.findOne({
        where: {
            id: data.assigned
          }
      }).then((user) => {
        const transferGroup = `task_${data.id}`;
        const dest = user.account_id;
        if(!dest) {
          return new Error('account_destination_invalid');
        }

        return stripe.transfers.create({
          amount: data.value * 100,
          currency: 'usd',
          destination: dest,
          source_type: 'card',
          transfer_group: transferGroup,
        }).then(function(transfer) {
          console.log('transfer');
          console.log(transfer);
          if(transfer.paid) {
            return models.Task.update({paid: transfer.paid, transfer_id: transfer.id}, {
              where: {
                id: data.id
              }
            }).then(function(update) {
              if(!update) {
                return new Error('update_task_reject');
              }
              return transfer;
            });
          }
        });
      })
    });

});
