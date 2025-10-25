const express = require('express')
const router = express.Router()
const secure = require('./secure')
require('../../modules/authenticationHelpers')
const controllers = require('../controllers/payment-request-transfer')

router.use(secure)
router.post('/', controllers.createPaymentRequestTransfer)
router.get('/', controllers.listPaymentRequestTransfers)
router.put('/:id', controllers.updatePaymentRequestTransfer)
//router.get('/search', controllers.searchPaymentRequestTransfer)
//router.get('/:id', controllers.fetchPaymentRequestTransfer)

module.exports = router
