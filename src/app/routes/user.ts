import express from 'express'
import * as controllers from '../controllers/auth'
import secure from './secure'
import { updateUser } from '../controllers/user/user'

const router = express.Router()

router.use('/', secure)

router.get('/', controllers.userFetch)
router.post('/customer', controllers.customerCreate)
router.get('/customer', controllers.customer)
router.put('/customer', controllers.customerUpdate)

router.get('/preferences', controllers.preferences)
router.get('/organizations', controllers.organizations)
router.put('/update', updateUser)

router.post('/account', controllers.accountCreate)
router.get('/account', controllers.account)
router.put('/account', controllers.accountUpdate)
router.delete('/account', controllers.accountDelete)

router.get('/account/balance', controllers.accountBalance)
router.get('/account/countries', controllers.accountCountries)

router.post('/bank_accounts', controllers.createBankAccount)
router.get('/bank_accounts', controllers.userBankAccount)
router.put('/bank_accounts', controllers.updateBankAccount)

router.delete('/delete', controllers.deleteUserById)

export default router