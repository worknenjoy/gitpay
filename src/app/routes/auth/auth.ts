import express from 'express'
import * as authenticationHelpers from '../../../modules/authenticationHelpers'
import * as controllers from '../../controllers/auth'
import { changeEmail } from '../../controllers/auth/auth'
import { confirmChangeEmail } from '../../controllers/auth/auth'
import secure from '../secure'

const router = express.Router()

router.get('/authenticated', authenticationHelpers.isAuth)
router.put('/auth/reset-password', controllers.resetPassword)
router.post('/auth/forgot-password', controllers.forgotPasswordNotification)

router.post('/auth/register', controllers.register)
router.get('/auth/activate', controllers.activate_user)
router.get('/auth/change-email/confirm', confirmChangeEmail)

router.use('/auth/', secure)
router.put('/auth/change-password', controllers.changePassword)
router.get('/auth/resend-activation-email', controllers.resend_activation_email)
router.post('/auth/change-email', changeEmail)

export default router
