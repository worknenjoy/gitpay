import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/project'

const router = express.Router()

router.get('/fetch/:id', controllers.fetchProject)
router.get('/list', controllers.listProjects)

export default router
