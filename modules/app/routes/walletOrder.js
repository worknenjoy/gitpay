const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/walletOrder')
const secure = require('./secure')

router.use(secure)

router.post('/', controllers.createWalletOrder)
router.put('/:id', controllers.updateWalletOrder)
router.get('/', controllers.walletOrderList)

module.exports = router
