import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/label'

const router = express.Router()

router.get('/search', controllers.labelSearchController)

export default router
