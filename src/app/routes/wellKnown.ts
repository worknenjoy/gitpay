import express from 'express'
import * as controllers from '../controllers/wellKnown'

const router = express.Router()

router.get('/.well-known/apple-developer-merchantid-domain-association', controllers.appleDeveloperMerchantIdDomainAssociation)

export default router
