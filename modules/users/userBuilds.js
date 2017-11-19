const Promise = require('bluebird');
const models = require('../../loading/loading');

 module.exports = Promise.method(function userBuilds(userParameters) {

    userParameters.password = models.User.generateHash(userParameters.password)

    return models.User
		        .build(
		            userParameters
		        )
		        .save()
		        .then((data) => {
		            return data;
		        }).catch((error) => {
		            console.log(error);
		            return false;
		        });

});