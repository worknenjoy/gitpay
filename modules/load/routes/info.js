const express = require('express')
const router = express.Router()
require('../../../loading/loading')
require('../../authenticationHelpers')
const controllers = require('../controllers/info')

router.get('/all', controllers.info)

module.exports = router
