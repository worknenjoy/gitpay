import express from 'express'
import '../../modules/authenticationHelpers'
import * as controllers from '../controllers/coupon'
import secure from './secure'

const router = express.Router()

router.use(secure)

router.post('/validate', controllers.validateCoupon)

export default router
