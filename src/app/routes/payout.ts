import express from 'express'
import secure from './secure'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/payout'

void authenticationHelpers

const router = express.Router()

router.use(secure)
router.post('/create', controllers.createPayout)
router.post('/request', controllers.requestPayout)
router.get('/search', controllers.searchPayout)

export default router
