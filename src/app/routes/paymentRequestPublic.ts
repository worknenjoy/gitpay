import express from 'express'
import * as controllers from '../controllers/payment-request-public'

const router = express.Router()

router.get('/:id/public', controllers.getPublicPaymentRequest)
router.post('/:id/checkout', controllers.createWhopCheckout)

export default router
