'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationHelpers = require('../../authenticationHelpers');
const models = require('../../../loading/loading');
const controllers = require('../controllers/order');

router.post('/create', controllers.createOrder);
router.get('/list', controllers.listOrders);
router.get('/fetch/:id', controllers.fetchOrders);

module.exports = router;
