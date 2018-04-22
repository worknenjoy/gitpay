const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function orderBuilds(orderParameters) {
  return models.Order
    .build(
      orderParameters
    )
    .save()
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return false;
    });

});
