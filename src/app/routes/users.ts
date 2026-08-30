import express from 'express'
import {
  getUserTypes,
  searchAll,
  getUserProfileStats,
  getUserMaintainedProjects
} from '../controllers/user/users'

const router = express.Router()

router.get('/', searchAll)
router.get('/types/:id', getUserTypes)
router.get('/:id/profile-stats', getUserProfileStats)
router.get('/:id/maintained-projects', getUserMaintainedProjects)

export default router
