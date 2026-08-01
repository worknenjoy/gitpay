import express from 'express'
import 'passport'
import secure from './secure'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import '../../models'
import * as controllers from '../controllers/order'

void authenticationHelpers

const router = express.Router()

router.get('/authorize', controllers.authorizeOrder)
// Public: Whop redirects the browser here after checkout (https tunnel → API → SPA)
router.get('/whop/return', controllers.whopCheckoutReturn)

router.use(secure)
router.get('/', controllers.listOrders)
router.post('/', controllers.createOrder)
router.get('/:id/details', controllers.detailsOrder)
router.get('/:id', controllers.fetchOrders)
router.post('/', controllers.createOrder)
router.post('/:id/refunds', controllers.refundOrder)
router.post('/:id/transfers', controllers.transferOrder)
router.post('/:id/cancel', controllers.cancelOrder)
router.post('/:id/payments', controllers.paymentOrder)
router.put('/:id', controllers.updateOrder)

export default router
