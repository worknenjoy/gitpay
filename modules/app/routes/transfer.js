const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/transfer')

router.post('/create', controllers.createTransfer)

module.exports = router
