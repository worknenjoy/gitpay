import express from 'express'
import '../../models'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/info'

const router = express.Router()

router.get('/all', controllers.info)

export default router
