const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
const controllers = require('../controllers/userRole')
const secure = require('./secure')

router.use(secure)
router.get('/fetch', controllers.fetchUserRole)
router.post('/create', controllers.createUserRole)
router.delete('/delete', controllers.deleteUserRole)

module.exports = router
