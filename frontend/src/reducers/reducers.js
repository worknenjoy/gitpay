import { combineReducers } from 'redux'
import { intlReducer } from 'react-intl-redux'

import { notification, dialog } from './notificationReducer'
import { loggedIn } from './loginReducer'
import { account, bankAccount } from './accountReducer'
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
import { transfers, transfer } from './transfersReducer'
import { payouts } from './payoutsReducer'

const reducers = combineReducers({
  notification,
  dialog,
  loggedIn,
  customer,
  account,
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
  organizations,
  organization,
  contact,
  taskSolutionReducer: taskSolution,
  couponReducer: couponReducer,
  profileReducer: profileReducer,
  intl: intlReducer,
  transfers,
  transfer,
  payouts
})

export default reducers
