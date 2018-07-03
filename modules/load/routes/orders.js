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

router.use(secure)
router.post('/create', controllers.createOrder)

module.exports = router
