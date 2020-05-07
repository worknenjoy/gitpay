const taskExists = require('./taskExists')
const taskSearch = require('./taskSearch')
const taskBuilds = require('./taskBuilds')
const taskUpdate = require('./taskUpdate')
const taskFetch = require('./taskFetch')
const taskPayment = require('./taskPayment')
const taskSync = require('./taskSync')
const taskDeleteById = require('./taskDeleteById')
const taskInvite = require('./taskInvite')
const taskMessage = require('./taskMessage')
const removeAssignedUser = require('./removeAssignedUser')
const taskFunding = require('./taskFunding')
const requestAssignedUser = require('./requestAssignedUser.js')

module.exports = {
  taskExists,
  taskSearch,
  taskBuilds,
  taskUpdate,
  taskFetch,
  taskPayment,
  taskSync,
  taskDeleteById,
  taskInvite,
  taskMessage,
  removeAssignedUser,
  taskFunding,
  requestAssignedUser
}
