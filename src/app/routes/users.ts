import express from 'express'
import { getUserTypes, searchAll } from '../controllers/user/users'

const router = express.Router()

router.get('/', searchAll)
router.get('/types/:id', getUserTypes)

export default router
