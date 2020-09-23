const express = require('express')
const router = express.Router()
const controllers = require('../controllers/team')

router.post('/core/join', controllers.requestJoinCoreTeamController)

module.exports = router
