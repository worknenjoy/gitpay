const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function taskUpdate(taskParameters) {
  return models.Task
    .update(taskParameters, {
      where: {
        id: taskParameters.id
      }
    }).then((data) => {
      return models.Task.findOne(
        {where: {id: taskParameters.id}, include: models.User}
      ).then((data) => {
        return data.dataValues;
      }).catch((error) => {
        console.log('error on task update find', error);
        return false;
      });
    }).catch((error) => {
      console.log('error on task update', error);
      return false;
    });
});
