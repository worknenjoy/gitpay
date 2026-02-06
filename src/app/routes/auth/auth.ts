import express from 'express'
import * as authenticationHelpers from '../../../utils/auth/authenticationHelpers'
import {
  register,
  forgotPasswordNotification,
  resetPassword,
  changePassword,
  activateUser,
  resendActivationEmail
} from '../../controllers/user/user'
import { changeEmail } from '../../controllers/auth/auth'
import { confirmChangeEmail } from '../../controllers/auth/auth'
import secure from '../secure'

const router = express.Router()

router.get('/authenticated', authenticationHelpers.isAuth)
router.put('/auth/reset-password', resetPassword)
router.post('/auth/forgot-password', forgotPasswordNotification)

router.post('/auth/register', register)
router.get('/auth/activate', activateUser)
router.get('/auth/change-email/confirm', confirmChangeEmail)

router.use('/auth/', secure)
router.put('/auth/change-password', changePassword)
router.get('/auth/resend-activation-email', resendActivationEmail)
router.post('/auth/change-email', changeEmail)

export default router
