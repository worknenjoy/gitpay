import express from 'express'
import secure from './secure'

const router = express.Router()

import {
  listPaymentRequestPayments,
  refundPaymentRequestPayment
} from '../controllers/payment-request-payment'

router.use(secure)
router.get('/', listPaymentRequestPayments)
router.post('/:id/refund', refundPaymentRequestPayment)

export default router
