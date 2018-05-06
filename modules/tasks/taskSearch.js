const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function taskSearch() {
  return models.Task
    .findAll(
      {include: [models.User, models.Order]}
    )
    .then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
      return false;
    });

});
