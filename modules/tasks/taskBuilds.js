const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function taskBuilds(taskParameters) {
  return models.Task
    .build(
      taskParameters
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
