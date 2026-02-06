import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/transfer'

void authenticationHelpers

const router = express.Router()

router.post('/create', controllers.createTransfer)
router.get('/search', controllers.searchTransfer)
router.put('/update', controllers.updateTransfer)
router.get('/fetch/:id', controllers.fetchTransfer)

export default router
