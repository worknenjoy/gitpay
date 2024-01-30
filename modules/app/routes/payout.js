const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/payout')

router.post('/create', controllers.createPayout)

module.exports = router