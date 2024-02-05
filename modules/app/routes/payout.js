const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/payout')

router.post('/create', controllers.createPayout)
router.get('/search', controllers.searchPayout)

module.exports = router