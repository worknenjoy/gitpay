import express from 'express'
import 'passport'
import '../../modules/authenticationHelpers'
import '../../models'
import * as controllers from '../controllers/organization'
import secure from './secure'

const router = express.Router()

router.get('/list', controllers.listOrganizations)
router.get('/fetch/:id', controllers.fetchOrganization)

router.use(secure)
router.post('/create', controllers.createOrganization)
router.put('/update', controllers.updateOrganization)

export default router
