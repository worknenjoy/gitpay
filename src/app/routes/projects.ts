import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/project'

void authenticationHelpers

const router = express.Router()

router.get('/fetch/:id', controllers.fetchProject)
router.get('/list', controllers.listProjects)

export default router
