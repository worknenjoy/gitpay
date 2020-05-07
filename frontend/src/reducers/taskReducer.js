import {
  CREATE_TASK_REQUESTED,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  DELETE_TASK_REQUESTED,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_ERROR,
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
  INVITE_TASK_REQUESTED,
  INVITE_TASK_SUCCESS,
  INVITE_TASK_ERROR,
  SYNC_TASK_REQUESTED,
  SYNC_TASK_SUCCESS,
  SYNC_TASK_ERROR,
  CHANGE_TASK_TAB,
  FUNDING_INVITE_TASK_REQUESTED,
  FUNDING_INVITE_TASK_SUCCESS,
  FUNDING_INVITE_TASK_ERROR
} from '../actions/taskActions'

import {
  ASSIGN_TASK_REQUESTED,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_ERROR,
  REMOVE_ASSIGNMENT_REQUESTED,
  REMOVE_ASSIGNMENT_SUCCESS,
  REMOVE_ASSIGNMENT_ERROR,
  MESSAGE_TASK_REQUESTED,
  MESSAGE_TASK_SUCCESS,
  MESSAGE_TASK_ERROR
} from '../actions/assignActions'

export const task = (state = {
  completed: true,
  filterOrdersBy: {},
  values: {
    available: 0,
    failed: 0,
    pending: 0,
    card: 0,
    paypal: 0,
    transferred: 0
  },
  error: {
    message: false
  },
  tab: 0,
  data: {
    value: 0,
    orders: [],
    assigns: [],
    assignedUser: {},
    url: '',
    provider: null,
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

    case DELETE_TASK_REQUESTED:
      return { ...state, completed: false }
    case DELETE_TASK_SUCCESS:
      return { ...state, completed: true }
    case DELETE_TASK_ERROR:
      return { ...state, completed: true, error: action.error }

    case INVITE_TASK_REQUESTED:
      return { ...state, completed: false }
    case INVITE_TASK_SUCCESS:
      return { ...state, completed: true }
    case INVITE_TASK_ERROR:
      return { ...state, completed: true, error: action.error }

    case FUNDING_INVITE_TASK_REQUESTED:
      return { ...state, completed: false }
    case FUNDING_INVITE_TASK_SUCCESS:
      return { ...state, completed: true }
    case FUNDING_INVITE_TASK_ERROR:
      return { ...state, completed: true, error: action.error }

    case ASSIGN_TASK_REQUESTED:
      return { ...state, completed: false }
    case ASSIGN_TASK_SUCCESS:
      return { ...state, completed: true, tab: action.tab }
    case ASSIGN_TASK_ERROR:
      return { ...state, completed: true, error: action.error }

    case MESSAGE_TASK_REQUESTED:
      return { ...state, completed: false }
    case MESSAGE_TASK_SUCCESS:
      return { ...state, completed: true, tab: action.tab }
    case MESSAGE_TASK_ERROR:
      return { ...state, completed: true, error: action.error }

    case REMOVE_ASSIGNMENT_REQUESTED:
      return { ...state, completed: false }
    case REMOVE_ASSIGNMENT_SUCCESS:
      return { ...state, completed: true }
    case REMOVE_ASSIGNMENT_ERROR:
      return { ...state, completed: true, error: action.error }

    case FETCH_TASK_REQUESTED:
      return { ...state, completed: false }
    case FETCH_TASK_SUCCESS:
      return { ...state, completed: true, data: action.data, filterOrdersBy: {} }
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
  filterType: 'all',
  filterValue: null,
  filterAdditional: null
}, action) => {
  switch (action.type) {
    case LIST_TASK_REQUESTED:
      return { ...state, completed: false }
    case LIST_TASK_SUCCESS:
      return { ...state, completed: true, data: action.data, filterType: 'status', filterValue: 'open' }
    case LIST_TASK_ERROR:
      return { ...state, completed: true, error: action.error }
    case FILTER_TASK_REQUESTED:
      return { ...state, completed: false }
    case FILTER_TASK_SUCCESS:
      return { ...state, completed: true, data: action.data, filterType: action.filterType, filterValue: action.filterValue, filterAdditional: action.filterAdditional }
    default:
      return state
  }
}
