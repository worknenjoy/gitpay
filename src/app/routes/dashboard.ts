import express from 'express'
import { getUserInfo } from '../controllers/user/user'
import secure from './secure'

const router = express.Router()

router.use(secure)
router.get('/', getUserInfo)

export default router
