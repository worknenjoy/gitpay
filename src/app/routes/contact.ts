import express from 'express'
import * as controllers from '../controllers/contact'

const router = express.Router()

router.post('/recruiters', controllers.contactRecruiters)

export default router
