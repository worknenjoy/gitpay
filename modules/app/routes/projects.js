const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/project')

router.get('/fetch/:id', controllers.fetchProject)
router.get('/list', controllers.listProjects)

module.exports = router
