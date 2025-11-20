const express = require('express')
const router = express.Router()
require('passport')
const secure = require('./secure')
require('../../modules/authenticationHelpers')
require('../../models')
const controllers = require('../controllers/order')

router.get('/authorize', controllers.authorizeOrder)

router.use(secure)
router.get('/', controllers.listOrders)
router.post('/', controllers.createOrder)
router.get('/:id', controllers.detailsOrder)
router.get('/:id/fetch', controllers.fetchOrders)
router.post('/', controllers.createOrder)
router.post('/:id/refunds', controllers.refundOrder)
router.post('/:id/transfers', controllers.transferOrder)
router.post('/:id/cancel', controllers.cancelOrder)
router.post('/:id/payments', controllers.paymentOrder)
router.put('/:id', controllers.updateOrder)

module.exports = router
