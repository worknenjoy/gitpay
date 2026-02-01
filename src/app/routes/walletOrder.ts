import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/walletOrder'
import secure from './secure'

const router = express.Router()

router.use(secure)

router.post('/', controllers.createWalletOrder)
router.put('/:id', controllers.updateWalletOrder)
router.get('/', controllers.walletOrderList)
router.get('/:id', controllers.walletOrderFetch)

export default router
