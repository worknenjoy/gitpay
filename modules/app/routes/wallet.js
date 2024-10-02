const express = require('express')
const router = express.Router()
require('../../authenticationHelpers')
const controllers = require('../controllers/wallet')
const secure = require('./secure')

router.use(secure)

router.post('/', controllers.createWallet)
router.put('/:id', controllers.updateWallet)
router.get('/', controllers.walletList)

module.exports = router
