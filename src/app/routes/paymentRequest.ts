import express from 'express'
import '../../modules/authenticationHelpers'
import secure from './secure'
import * as controllers from '../controllers/payment-request'

const router = express.Router()

router.use(secure)
router.post('/', controllers.createPaymentRequest)
router.get('/', controllers.listPaymentRequests)
router.put('/:id', controllers.updatePaymentRequest)

export default router
