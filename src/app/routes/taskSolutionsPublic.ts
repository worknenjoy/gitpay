import express from 'express'
import * as controllers from '../controllers/taskSolution-public'

const router = express.Router()

router.get('/:userId', controllers.listPublicTaskSolutions)

export default router
