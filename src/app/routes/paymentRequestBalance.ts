import express from 'express'
import secure from './secure'

const router = express.Router()

import { listPaymentRequestBalances } from '../controllers/payment-request-balance'

router.use(secure)
router.get('/', listPaymentRequestBalances)

export default router
