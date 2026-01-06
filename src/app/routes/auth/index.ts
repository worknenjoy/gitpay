import express from 'express'
import routerAuth from './auth'
import routerProviders from './providers'

const router = express.Router()

router.use('/', routerAuth)
router.use('/', routerProviders)

export default router
