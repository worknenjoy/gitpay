const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/task')
const secure = require('./secure')

router.get('/fetch/:id', controllers.fetchTask)
router.get('/:id/sync/:field', controllers.syncTask)
router.post('/:id/invite/', controllers.inviteUserToTask)
router.post('/:id/funding/', controllers.inviteToFundingTask)
router.put('/update', controllers.updateTask)
router.post('/:id/report', controllers.reportTask)
router.post('/:id/claim', controllers.requestClaimTask)
router.get('/list', controllers.listTasks)

router.use(secure)
router.post('/:id/message/', controllers.messageInterestedToTask)
router.post('/:id/message/author', controllers.messageAuthor)
router.post('/create', controllers.createTask)
router.post('/payments', controllers.paymentTask)
router.delete('/delete/:id', controllers.deleteTaskById)
router.get('/delete/:taskId/:userId', controllers.deleteTaskFromReport)

router.put('/:id/assignment/remove', controllers.removeAssignedUser)
router.put('/assignment/request', controllers.assignedUser)
router.post('/assignment/request', controllers.requestAssignedUser)

module.exports = router
