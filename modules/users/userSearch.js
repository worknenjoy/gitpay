const Promise = require('bluebird');
const models = require('../../loading/loading');

 module.exports = Promise.method(function userSearch() {

	return models.User
				.findAll(
	            	{}
	        	)
	        	.then((data) => {
	            	return data;
	        	}).catch((error) => {
	            	console.log(error);
	            	return false;
	        	});

});