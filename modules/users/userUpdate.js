const Promise = require('bluebird');
const models = require('../../loading/loading');

 module.exports = Promise.method(function userUpdate(userParameters) {

    return models.User
		        .update(userParameters, {
		        	where: {
		        		email: userParameters.email
		        	}
		        }).then((data) => {
		            return data;
		        }).catch((error) => {
		            console.log(error);
		            return false;
		        });


});