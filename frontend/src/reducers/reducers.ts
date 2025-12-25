import { combineReducers } from 'redux'
import { intlReducer } from 'react-intl-redux'

import { notification, dialog } from './notificationReducer'
import { loggedIn } from './loginReducer'
import { user } from './userReducer'
import { account, balance, countries, bankAccount } from './accountReducer'
import { customer } from './customerReducer'
import { project, projects } from './projectReducer'
import { task, tasks } from './taskReducer'
import { team } from './teamReducer'
import { order, orders } from './orderReducer'
import { info } from './infoReducer'
import { preferences } from './preferencesReducer'
import { roles } from './userRoleReducer'
import { organizations, organization } from './organizationsReducer'
import { contact } from './contactReducer'
import taskSolution from './taskSolutionReducer'
import couponReducer from './couponReducer'
import { profileReducer } from './profileReducer'
import { labels } from './labelReducer'
import { languages } from './languageReducer'
import { transfers, transfer } from './transfersReducer'
import { payouts } from './payoutsReducer'
import { wallet, wallets } from './walletReducer'
import { walletOrder, walletOrders } from './walletOrderReducer'
import { paymentRequest, paymentRequests } from './paymentRequestReducer'
import { paymentRequestTransfers } from './paymentRequestTransferReducer'
import { paymentRequestPayments, paymentRequestPayment } from './paymentRequestPaymentReducer'
import { paymentRequestBalances } from './paymentRequestBalanceReducer'
import { dashboardReducer } from './dashboardReducer'

const reducers = combineReducers({
  notification,
  dialog,
  loggedIn,
  user,
  customer,
  account,
  balance,
  countries,
  bankAccount,
  order,
  orders,
  project,
  projects,
  task,
  tasks,
  team,
  info,
  preferences,
  roles,
  labels,
  languages,
  organizations,
  organization,
  contact,
  taskSolutionReducer: taskSolution,
  couponReducer: couponReducer,
  profileReducer: profileReducer,
  intl: intlReducer,
  transfers,
  transfer,
  payouts,
  wallets,
  wallet,
  walletOrders,
  walletOrder,
  paymentRequest,
  paymentRequests,
  paymentRequestTransfers,
  paymentRequestPayments,
  paymentRequestPayment,
  paymentRequestBalances,
  dashboard: dashboardReducer
})

export default reducers
