import { combineReducers } from 'redux'

import { notification, dialog } from './notificationReducer'
import { loggedIn } from './loginReducer'
import { account, bankAccount } from './accountReducer'
import { task, tasks } from './taskReducer'
import { order } from './orderReducer'
import { info } from './infoReducer'

const reducers = combineReducers({
  notification,
  dialog,
  loggedIn,
  account,
  bankAccount,
  order,
  task,
  tasks,
  info
})

export default reducers
