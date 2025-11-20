const express = require('express')
const router = express.Router()
require('../../modules/authenticationHelpers')
const secure = require('./secure')
const controllers = require('../controllers/payment-request')

router.use(secure)
router.post('/', controllers.createPaymentRequest)
router.get('/', controllers.listPaymentRequests)
router.put('/:id', controllers.updatePaymentRequest)

module.exports = router
