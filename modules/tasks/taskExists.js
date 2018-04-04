const models = require('../../loading/loading');
const Promise = require('bluebird');

module.exports = Promise.method(function taskExists(taskAttributes) {

  return models.Task
    .findOne({
      where: {
        id: taskAttributes.id
      }
    }).then((task) => {
      if (!task) return false;
      return task;
    }).catch((error) => {
      console.log(error);
      throw error;
    });

});

