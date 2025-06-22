const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const secure = require('./secure')
const controllers = require('../controllers/payment-request')

router.use(secure)
router.post('/create', controllers.createPaymentRequest)
router.get('/', controllers.listPaymentRequests)

module.exports = router