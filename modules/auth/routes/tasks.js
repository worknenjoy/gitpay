'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationHelpers = require('../../authenticationHelpers');
const models = require('../../../loading/loading');
const controllers = require('../controllers/task');

router.post('/create', controllers.createTask);
router.get('/list', controllers.listTasks);
router.get('/fetch/:id', controllers.fetchTask);
router.put('/update', controllers.updateTask);

module.exports = router;
