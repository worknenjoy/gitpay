const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
const controllers = require('../controllers/role')
const secure = require('./secure')

router.use(secure)
router.get('/fetch', controllers.fetchRole)
router.get('/fetch/:id', controllers.fetchRoleById)
router.post('/create', controllers.createRole)
router.delete('/delete/:id', controllers.deleteRoleById)

module.exports = router
