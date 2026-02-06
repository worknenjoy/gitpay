import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/label'

void authenticationHelpers

const router = express.Router()

router.get('/search', controllers.labelSearchController)

export default router
