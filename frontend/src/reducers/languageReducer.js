import {
  LIST_LAGUAGE_REQUEST,
  LIST_LAGUAGE_SUCCESS,
  LIST_LAGUAGE_ERROR
} from '../actions/languageActions'

export const languages = (
  state = {
    completed: true,
    data: []
  },
  action
) => {
  switch (action.type) {
    case LIST_LAGUAGE_REQUEST:
      return { ...state, completed: false }
    case LIST_LAGUAGE_SUCCESS:
      return { ...state, completed: true, data: action.data }
    case LIST_LAGUAGE_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
