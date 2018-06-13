'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const controllers = require('../controllers/webhook');

router.post('/', controllers.updateWebhook);

module.exports = router;
