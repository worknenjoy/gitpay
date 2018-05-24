const Promise = require('bluebird');
const models = require('../../loading/loading');

 module.exports = Promise.method(function userCustomer(userParameters) {
  console.log('user parameters');
  console.log(userParameters);
	return models.User
				.findOne(
          {
            where: { id: userParameters.id }
          }
	        	)
	        	.then((data) => {
	            	return data;
	        	}).catch((error) => {
	            	console.log(error);
	            	return false;
	        	});

});
