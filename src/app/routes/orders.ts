import express from 'express'
import 'passport'
import secure from './secure'
import '../../modules/authenticationHelpers'
import '../../models'
import * as controllers from '../controllers/order'

const router = express.Router()

router.get('/authorize', controllers.authorizeOrder)

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
