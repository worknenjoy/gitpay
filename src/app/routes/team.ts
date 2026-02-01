import express from 'express'
import * as controllers from '../controllers/team'

const router = express.Router()

router.post('/core/join', controllers.requestJoinCoreTeamController)

export default router
