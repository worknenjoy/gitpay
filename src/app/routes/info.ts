import express from 'express'
import '../../models'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/info'

void authenticationHelpers

const router = express.Router()

router.get('/all', controllers.info)

export default router
