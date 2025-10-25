const express = require('express')
const router = express.Router()
require('../../modules/authenticationHelpers')
const controllers = require('../controllers/label')

router.get('/search', controllers.labelSearchController)

module.exports = router
