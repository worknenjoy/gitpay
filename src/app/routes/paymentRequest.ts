import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import secure from './secure'
import * as controllers from '../controllers/payment-request'

void authenticationHelpers

const router = express.Router()

router.use(secure)
router.post('/', controllers.createPaymentRequest)
router.get('/', controllers.listPaymentRequests)
router.put('/:id', controllers.updatePaymentRequest)

export default router
