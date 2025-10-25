const express = require('express')
const router = express.Router()
require('../../modules/authenticationHelpers')
const controllers = require('../controllers/transfer')

router.post('/create', controllers.createTransfer)
router.get('/search', controllers.searchTransfer)
router.put('/update', controllers.updateTransfer)
router.get('/fetch/:id', controllers.fetchTransfer)

module.exports = router
