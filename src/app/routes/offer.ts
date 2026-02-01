import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/offer'
import secure from './secure'

const router = express.Router()

router.use(secure)
router.put('/:id', controllers.updateOffer)

export default router
