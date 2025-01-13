const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/language')

router.get('/search', controllers.languageSearchController)
router.get('/task/search', controllers.projectLanguageSearchController)

module.exports = router
