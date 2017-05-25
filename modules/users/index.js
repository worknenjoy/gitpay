const userExists = require('./userExists');
const userSearch = require('./userSearch');
const userBuilds = require('./userBuilds');
const userUpdate = require('./userUpdate');

module.exports = {
  userExists: userExists,
  userSearch: userSearch,
  userBuilds: userBuilds,
  userUpdate: userUpdate
}