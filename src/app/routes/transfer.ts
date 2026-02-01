import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/transfer'

const router = express.Router()

router.post('/create', controllers.createTransfer)
router.get('/search', controllers.searchTransfer)
router.put('/update', controllers.updateTransfer)
router.get('/fetch/:id', controllers.fetchTransfer)

export default router
