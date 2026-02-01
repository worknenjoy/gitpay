import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/task'
import secure from './secure'

const router = express.Router()

router.get('/fetch/:id', controllers.fetchTask)
router.get('/:id/sync/:field', controllers.syncTask)
router.post('/:id/invite/', controllers.inviteUserToTask)
router.post('/:id/funding/', controllers.inviteToFundingTask)
router.post('/:id/report', controllers.reportTask)
router.post('/:id/claim', controllers.requestClaimTask)
router.get('/list', controllers.listTasks)

router.use(secure)
router.post('/:id/message/', controllers.messageInterestedToTask)
router.post('/:id/message/author', controllers.messageAuthor)
router.post('/:id/offer/:offerId/message', controllers.messageOffer)
router.post('/create', controllers.createTask)
router.put('/update', controllers.updateTask)
router.post('/payments', controllers.paymentTask)
router.delete('/delete/:id', controllers.deleteTaskById)
router.get('/delete/:taskId/:userId', controllers.deleteTaskFromReport)

router.put('/:id/assignment/remove', controllers.removeAssignedUser)
router.put('/assignment/request', controllers.assignedUser)
router.post('/assignment/request', controllers.requestAssignedUser)

export default router
