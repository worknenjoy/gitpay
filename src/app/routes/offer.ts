import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/offer'
import secure from './secure'

void authenticationHelpers

const router = express.Router()

router.use(secure)
router.put('/:id', controllers.updateOffer)

export default router
