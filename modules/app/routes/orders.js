const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
require('../../../models')
const controllers = require('../controllers/order')

router.get('/list', controllers.listOrders)
router.get('/fetch/:id', controllers.fetchOrders)
router.get('/details/:id', controllers.detailsOrder)
router.get('/refund/:id', controllers.refundOrder)
router.put('/update', controllers.updateOrder)
router.get('/authorize', controllers.authorizeOrder)
router.post('/create', controllers.createOrder)

const secure = require('./secure')
router.use(secure)
router.post('/transfer/:id', controllers.transferOrder)
router.post('/cancel', controllers.cancelOrder)
router.post('/payment', controllers.paymentOrder)

module.exports = router
