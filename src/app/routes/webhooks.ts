import express from 'express'
const controllerConnect = require('../controllers/webhooks/webhook-connect')
const controllerPlatform = require('../controllers/webhooks/webhook-platform')
const controllerWhop = require('../controllers/webhooks/webhook-whop')
import * as controllerGithub from '../controllers/webhooks/webhook-github'

const router = express.Router()

router.post('/stripe-platform', controllerPlatform.webhookPlatform)
router.post('/stripe-connect', controllerConnect.webhookConnect)
router.post('/whop', controllerWhop.webhookWhop)
router.post('/github', controllerGithub.github)

export default router
