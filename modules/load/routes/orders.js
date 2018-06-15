const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
require('../../../loading/loading')
const controllers = require('../controllers/order')

const secure = require('./secure')
router.use(secure)

router.post('/create', controllers.createOrder)
router.get('/list', controllers.listOrders)
router.get('/fetch/:id', controllers.fetchOrders)

module.exports = router
