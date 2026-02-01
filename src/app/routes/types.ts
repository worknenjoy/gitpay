import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/type'

const router = express.Router()

router.get('/search', controllers.typeSearchController)

export default router
