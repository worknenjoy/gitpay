const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function orderUpdate(orderParameters) {

  return models.Order
    .update(orderParameters, {
      where: {
        id: orderParameters.id
      }
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
      return false;
    });
});
