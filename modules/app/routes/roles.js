const express = require('express')
const router = express.Router()
require('passport')
require('../../authenticationHelpers')
const controllers = require('../controllers/role')
const secure = require('./secure')

router.use(secure)
router.get('/fetch', controllers.fetchRole)
router.post('/create', controllers.createRole)
router.delete('/delete', controllers.deleteRole)
router.put('/update', controllers.updateRole)

module.exports = router
