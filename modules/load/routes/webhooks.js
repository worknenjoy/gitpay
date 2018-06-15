const express = require('express')
const router = express.Router()
require('passport')
const controllers = require('../controllers/webhook')
const secure = require('./secure')

router.use(secure)

router.post('/', controllers.updateWebhook)

module.exports = router
