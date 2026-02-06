import express from 'express'
import secure from './secure'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/payment-request-transfer'

void authenticationHelpers

const router = express.Router()

router.use(secure)
router.post('/', controllers.createPaymentRequestTransfer)
router.get('/', controllers.listPaymentRequestTransfers)
router.put('/:id', controllers.updatePaymentRequestTransfer)
//router.get('/search', controllers.searchPaymentRequestTransfer)
//router.get('/:id', controllers.fetchPaymentRequestTransfer)

export default router
