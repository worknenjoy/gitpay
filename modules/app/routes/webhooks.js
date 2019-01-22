const express = require('express')
const router = express.Router()
const controllers = require('../controllers/webhook')

router.post('/', controllers.updateWebhook)
router.post('/github', controllers.github)

module.exports = router
