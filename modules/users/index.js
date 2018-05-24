const userExists = require('./userExists');
const userSearch = require('./userSearch');
const userBuilds = require('./userBuilds');
const userUpdate = require('./userUpdate');
const userCustomer = require('./userCustomer');

module.exports = {
  userExists: userExists,
  userSearch: userSearch,
  userBuilds: userBuilds,
  userUpdate: userUpdate,
  userCustomer: userCustomer
}
