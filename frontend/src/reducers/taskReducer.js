import {
  CREATE_TASK_REQUESTED,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  FETCH_TASK_REQUESTED,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR,
  LIST_TASK_REQUESTED,
  LIST_TASK_SUCCESS,
  LIST_TASK_ERROR,
  FILTER_TASK_REQUESTED,
  FILTER_TASK_SUCCESS,
  FILTER_TASK_ORDERS_REQUESTED,
  FILTER_TASK_ORDERS_SUCCESS,
  PAYMENT_TASK_REQUESTED,
  PAYMENT_TASK_SUCCESS,
  PAYMENT_TASK_ERROR,
  SYNC_TASK_REQUESTED,
  SYNC_TASK_SUCCESS,
  SYNC_TASK_ERROR,
  CHANGE_TASK_TAB
} from '../actions/taskActions'

import {
  ASSIGN_TASK_REQUESTED,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_ERROR
} from '../actions/assignActions'

export const task = (state = {
  completed: true,
  filterOrdersBy: {},
  values: {
    available: 0,
    failed: 0,
    pending: 0
  },
  error: {
    message: false
  },
  tab: 0,
  data: {
    value: 0,
    orders: [],
    assigns: [],
    url: '',
    metadata: {
      company: '',
      issue: {
        state: 'open',
        body: '',
        user: {
          avatar_url: 'https://loading.io/spinners/disqus/index.discuss-messesage-preloader.svg'
        }
      }
    }
  }
}, action) => {
  switch (action.type) {
    case CREATE_TASK_REQUESTED:
      return { ...state, completed: false }
    case CREATE_TASK_SUCCESS:
      return { ...state, completed: true }
    case CREATE_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case UPDATE_TASK_REQUESTED:
      return { ...state, completed: false }
    case UPDATE_TASK_SUCCESS:
      return { ...state, completed: true }
    case UPDATE_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case CHANGE_TASK_TAB:
      return { ...state, tab: action.tab }
    case ASSIGN_TASK_REQUESTED:
      return { ...state, completed: false }
    case ASSIGN_TASK_SUCCESS:
      return { ...state, completed: true, tab: action.tab }
    case ASSIGN_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case FETCH_TASK_REQUESTED:
      return { ...state, completed: false }
    case FETCH_TASK_SUCCESS:
      return { ...state, completed: true, data: action.data }
    case FETCH_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case FILTER_TASK_ORDERS_REQUESTED:
      return { ...state, completed: false }
    case FILTER_TASK_ORDERS_SUCCESS:
      return { ...state, completed: true, data: action.data, filterOrdersBy: action.filterOrdersBy }
    case SYNC_TASK_REQUESTED:
      return { ...state, completed: false }
    case SYNC_TASK_SUCCESS:
      return { ...state, completed: true, values: action.values.value }
    case SYNC_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case PAYMENT_TASK_REQUESTED:
      return { ...state, completed: false }
    case PAYMENT_TASK_SUCCESS:
      return { ...state, completed: true }
    case PAYMENT_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export const tasks = (state = {
  completed: true,
  error: {
    message: false
  },
  data: [],
  filterType: 'all'
}, action) => {
  switch (action.type) {
    case LIST_TASK_REQUESTED:
      return { ...state, completed: false }
    case LIST_TASK_SUCCESS:
      return { ...state, completed: true, data: action.data, filterType: 'all' }
    case LIST_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case FILTER_TASK_REQUESTED:
      return { ...state, completed: false }
    case FILTER_TASK_SUCCESS:
      return { ...state, completed: true, data: action.data, filterType: action.filterType }
    default:
      return state
  }
}
