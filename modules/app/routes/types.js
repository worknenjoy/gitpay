const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/type')

router.get('/search', controllers.typeSearchController)

module.exports = router
