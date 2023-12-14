const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')

const controllers = require('../controllers/offer')
const secure = require('./secure')

router.use(secure)
router.put('/:id', controllers.updateOffer)

module.exports = router
