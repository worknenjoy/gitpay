import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/taskSolution'
import secure from './secure'

void authenticationHelpers

const router = express.Router()

router.use(secure)

router.get('/', controllers.getTaskSolution)
router.get('/fetch', controllers.fetchPullRequestData)
router.post('/create', controllers.createTaskSolution)
router.patch('/:id', controllers.updateTaskSolution)

export default router
