const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
require('../../../models')
const controllers = require('../controllers/organization')

const secure = require('./secure')

router.use(secure)
router.post('/create', controllers.createOrganization)
router.put('/update', controllers.updateOrganization)

module.exports = router
