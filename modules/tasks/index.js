const taskExists = require('./taskExists');
const taskSearch = require('./taskSearch');
const taskBuilds = require('./taskBuilds');
const taskUpdate = require('./taskUpdate');

module.exports = {
  taskExists: taskExists,
  taskSearch: taskSearch,
  taskBuilds: taskBuilds,
  taskUpdate: taskUpdate
}
