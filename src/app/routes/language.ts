import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/language'

const router = express.Router()

router.get('/search', controllers.languageSearchController)
router.get('/task/search', controllers.projectLanguageSearchController)

export default router
