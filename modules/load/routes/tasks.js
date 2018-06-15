const express = require('express')
const router = express.Router()
const authenticationHelpers = require('../../authenticationHelpers')
const controllers = require('../controllers/task')
const secure = require('./secure')

router.use(secure)

router.post('/create', controllers.createTask)
router.get('/list', controllers.listTasks)
router.get('/fetch/:id', controllers.fetchTask)
router.put('/update', controllers.updateTask)
router.post('/payments', controllers.paymentTask)
router.get('/:id/sync/:field', controllers.syncTask)

module.exports = router
