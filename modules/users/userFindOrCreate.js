const Promise = require('bluebird');
const models = require('../../loading/loading');

module.exports = Promise.method(function userBuilds(userParameters) {

  userParameters.password = models.User.generateHash(userParameters.password)

  return models.User
    .findOrCreate(
      userParameters
    )
    .then((data) => {
      console.log(data);
      return data;
    }).catch((error) => {
      console.log(error);
      return false;
    });

});
