import express from 'express'
import secure from './secure'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/payout'

const router = express.Router()

router.use(secure)
router.post('/create', controllers.createPayout)
router.post('/request', controllers.requestPayout)
router.get('/search', controllers.searchPayout)

export default router
