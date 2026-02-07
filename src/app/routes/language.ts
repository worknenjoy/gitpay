import express from 'express'
import * as authenticationHelpers from '../../utils/auth/authenticationHelpers'
import * as controllers from '../controllers/language'

void authenticationHelpers

const router = express.Router()

router.get('/search', controllers.languageSearchController)
router.get('/task/search', controllers.projectLanguageSearchController)

export default router
