const taskExists = require('./taskExists')
const taskSearch = require('./taskSearch')
const taskBuilds = require('./taskBuilds')
const taskUpdate = require('./taskUpdate')
const taskFetch = require('./taskFetch')
const taskPayment = require('./taskPayment')
const taskSync = require('./taskSync')
const { taskDeleteById } = require('./taskDeleteById')
const taskInvite = require('./taskInvite')
const taskMessage = require('./taskMessage')
const taskMessageAuthor = require('./taskMessageAuthor')
const removeAssignedUser = require('./removeAssignedUser')
const taskFunding = require('./taskFunding')
const taskReport = require('./taskReport')
const taskClaim = require('./taskClaim')
const taskDeleteConfirmation = require('./taskDeleteConfirmation')
const requestAssignedUser = require('./requestAssignedUser.js')
const taskSolutionFetchData = require('./taskSolutionFetchData')
const taskSolutionCreate = require('./taskSolutionCreate')
const taskSolutionGet = require('./taskSolutionGet')
const taskSolutionUpdate = require('./taskSolutionUpdate')

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
  taskMessageAuthor,
  removeAssignedUser,
  taskFunding,
  taskReport,
  taskClaim,
  taskDeleteConfirmation,
  requestAssignedUser,
  taskSolutionFetchData,
  taskSolutionCreate,
  taskSolutionGet,
  taskSolutionUpdate
}
