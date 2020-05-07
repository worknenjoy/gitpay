const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/task')
const secure = require('./secure')

router.get('/fetch/:id', controllers.fetchTask)
router.get('/:id/sync/:field', controllers.syncTask)
router.get('/list', controllers.listTasks)
router.post('/:id/invite/', controllers.inviteUserToTask)
router.post('/:id/funding/', controllers.inviteToFundingTask)
router.put('/update', controllers.updateTask)

router.use(secure)
router.post('/:id/message/', controllers.messageInterestedToTask)
router.post('/create', controllers.createTask)
router.post('/payments', controllers.paymentTask)
router.delete('/delete/:id', controllers.deleteTaskById)

router.put('/:id/assignment/remove', controllers.removeAssignedUser)
router.put('/assignment/request', controllers.assignedUser)
router.post('/assignment/request', controllers.requestAssignedUser)

module.exports = router
