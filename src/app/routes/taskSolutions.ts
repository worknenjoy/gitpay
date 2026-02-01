import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/taskSolution'
import secure from './secure'

const router = express.Router()

router.use(secure)

router.get('/', controllers.getTaskSolution)
router.get('/fetch', controllers.fetchPullRequestData)
router.post('/create', controllers.createTaskSolution)
router.patch('/:id', controllers.updateTaskSolution)

export default router
