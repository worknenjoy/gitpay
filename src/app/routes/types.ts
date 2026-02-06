import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/type'

void authenticationHelpers

const router = express.Router()

router.get('/search', controllers.typeSearchController)

export default router
