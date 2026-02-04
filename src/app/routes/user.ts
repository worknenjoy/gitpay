import express from 'express'
import { userFetch, preferences, organizations, deleteUserById } from '../controllers/user/user'
import { customer, customerCreate, customerUpdate } from '../controllers/user/customers'
import {
  account,
  accountCreate,
  accountCountries,
  accountBalance,
  accountUpdate,
  accountDelete
} from '../controllers/user/account'
import {
  createBankAccount,
  updateBankAccount,
  userBankAccount
} from '../controllers/user/bank-account'
import secure from './secure'
import { updateUser } from '../controllers/user/user'

const router = express.Router()

router.use('/', secure)

router.get('/', userFetch)
router.put('/', updateUser)

router.post('/customer', customerCreate)
router.get('/customer', customer)
router.put('/customer', customerUpdate)

router.get('/preferences', preferences)
router.get('/organizations', organizations)

router.post('/account', accountCreate)
router.get('/account', account)
router.put('/account', accountUpdate)
router.delete('/account', accountDelete)

router.get('/account/balance', accountBalance)
router.get('/account/countries', accountCountries)

router.post('/bank_accounts', createBankAccount)
router.get('/bank_accounts', userBankAccount)
router.put('/bank_accounts', updateBankAccount)

router.delete('/delete', deleteUserById)

export default router
