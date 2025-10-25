const express = require('express')
const router = express.Router()
require('../../modules/authenticationHelpers')
const controllers = require('../controllers/taskSolution')
const secure = require('./secure')

router.use(secure)

router.get('/', controllers.getTaskSolution)
router.get('/fetch', controllers.fetchPullRequestData)
router.post('/create', controllers.createTaskSolution)
router.patch('/:id', controllers.updateTaskSolution)

module.exports = router
