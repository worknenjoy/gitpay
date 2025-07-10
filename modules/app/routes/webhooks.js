const express = require('express')
const router = express.Router()
const controllers = require('../controllers/webhook')
const controllerConnect = require('../controllers/webhooks/webhook-connect')
const controllerPlatform = require('../controllers/webhooks/webhook-platform')
const controllerGithub = require('../controllers/webhooks/webhook-github')

router.post('/', controllers.updateWebhook)
router.post('/stripe-platform', controllerPlatform.webhookPlatform)
router.post('/stripe-connect', controllerConnect.webhookConnect)
router.post('/github', controllerGithub.github)

module.exports = router
