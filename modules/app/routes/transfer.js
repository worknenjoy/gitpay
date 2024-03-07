const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/transfer')

router.post('/create', controllers.createTransfer)
router.get('/search', controllers.searchTransfer)
router.put('/update', controllers.updateTransfer)

module.exports = router
