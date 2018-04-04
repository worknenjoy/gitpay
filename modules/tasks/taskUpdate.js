const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function taskUpdate(taskParameters) {

  return models.User
    .update(taskParameters, {
      where: {
        id: taskParameters.email
      }
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
      return false;
    });
});
