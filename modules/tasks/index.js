const taskExists = require('./taskExists')
const taskSearch = require('./taskSearch')
const taskBuilds = require('./taskBuilds')
const taskUpdate = require('./taskUpdate')
const taskFetch = require('./taskFetch')
const taskPayment = require('./taskPayment')
const taskSync = require('./taskSync')
const taskDeleteById = require('./taskDeleteById')

module.exports = {
  taskExists,
  taskSearch,
  taskBuilds,
  taskUpdate,
  taskFetch,
  taskPayment,
  taskSync,
  taskDeleteById
}
