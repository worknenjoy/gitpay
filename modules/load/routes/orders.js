const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
require('../../../loading/loading')
const controllers = require('../controllers/order')

const secure = require('./secure')

router.get('/list', controllers.listOrders)
router.get('/fetch/:id', controllers.fetchOrders)
router.get('/update', controllers.updateOrders)
router.post('/create', controllers.createOrder)

router.use(secure)
router.post('/payment', controllers.paymentOrder)

module.exports = router
