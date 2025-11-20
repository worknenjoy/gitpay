import express from 'express'
import secure from './secure'

const router = express.Router()

import { listPaymentRequestPayments } from '../controllers/payment-request-payment'

router.use(secure)
router.get('/', listPaymentRequestPayments)

export default router
