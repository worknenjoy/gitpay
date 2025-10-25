const express = require('express')
const router = express.Router()
require('../../modules/authenticationHelpers')
const controllers = require('../controllers/coupon')
const secure = require('./secure')

router.use(secure)

router.post('/validate', controllers.validateCoupon)

module.exports = router
