const express = require('express')
const router = express.Router()
const secure = require('./secure')
require('../../authenticationHelpers')
const controllers = require('../controllers/payout')

router.use(secure)
router.post('/create', controllers.createPayout)
router.get('/search', controllers.searchPayout)

module.exports = router