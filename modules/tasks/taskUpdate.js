const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function taskUpdate(taskParameters) {
  return models.Task
    .update(taskParameters, {
      where: {
        id: taskParameters.id,
      },
      include: [models.User, models.Order]
    }).then((data) => {
      return models.Task.findOne(
        {where: {id: taskParameters.id}, include: [models.User, models.Order]}
      ).then((task) => {
        if (taskParameters.Orders) {
          task.createOrder(taskParameters.Orders[0]).then((order) => {
            return task.dataValues;
          }).catch(error => console.log(error));
        }
        return task.dataValues;
      }).catch((error) => {
        console.log('error on task update find', error);
        return false;
      });

    }).catch((error) => {
      console.log('error on task update', error);
      return false;
    });
});
