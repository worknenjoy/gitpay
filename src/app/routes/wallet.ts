import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/wallet'
import secure from './secure'

void authenticationHelpers

const router = express.Router()

router.use(secure)

router.post('/', controllers.createWallet)
router.put('/:id', controllers.updateWallet)
router.get('/', controllers.walletList)
router.get('/:id', controllers.walletFetch)

export default router
