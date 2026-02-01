import express from 'express'
const controllerConnect = require('../controllers/webhooks/webhook-connect')
const controllerPlatform = require('../controllers/webhooks/webhook-platform')
import * as controllerGithub from '../controllers/webhooks/webhook-github'

const router = express.Router()

router.post('/stripe-platform', controllerPlatform.webhookPlatform)
router.post('/stripe-connect', controllerConnect.webhookConnect)
router.post('/github', controllerGithub.github)

export default router
