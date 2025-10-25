const express = require('express')
const router = express.Router()
require('../../models')
require('../../modules/authenticationHelpers')
const controllers = require('../controllers/info')

router.get('/all', controllers.info)

module.exports = router
