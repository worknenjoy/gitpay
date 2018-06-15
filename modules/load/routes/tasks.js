const express = require('express')
const router = express.Router()
require('passport')
const authenticationHelpers = require('../../authenticationHelpers')
require('../../../loading/loading')
const controllers = require('../controllers/task')
const secure = require('./secure')

router.use(secure)

router.post('/create', controllers.createTask)
router.get('/list', controllers.listTasks)
router.get('/fetch/:id', controllers.fetchTask)
router.put('/update', controllers.updateTask)
router.post('/payments', controllers.paymentTask, authenticationHelpers.isAuth)

module.exports = router
