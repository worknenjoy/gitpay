import { combineReducers } from 'redux'
import { intlReducer } from 'react-intl-redux'

import { notification, dialog } from './notificationReducer'
import { loggedIn } from './loginReducer'
import { account, bankAccount } from './accountReducer'
import { task, tasks } from './taskReducer'
import { order } from './orderReducer'
import { info } from './infoReducer'
import { preferences } from './preferencesReducer'
import { roles } from './roleReducer'
import { organizations } from './organizationsReducer'
import { contact } from './contactReducer'

const reducers = combineReducers({
  notification,
  dialog,
  loggedIn,
  account,
  bankAccount,
  order,
  task,
  tasks,
  info,
  preferences,
  roles,
  organizations,
  contact,
  intl: intlReducer
})

export default reducers
