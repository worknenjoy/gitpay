import {
  FETCH_PREFERENCES_REQUESTED,
  FETCH_PREFERENCES_SUCCESS,
  FETCH_PREFERENCES_ERROR
} from '../actions/preferencesActions'

export const preferences = (state = { language: null, country: null, completed: true, error: {} }, action) => {
  switch (action.type) {
    case FETCH_PREFERENCES_REQUESTED:
      return { ...state, completed: action.completed }
    case FETCH_PREFERENCES_SUCCESS:
      return { ...state, language: action.language, country: action.country, completed: action.completed }
    case FETCH_PREFERENCES_ERROR:
      return { ...state, error: action.error, completed: action.completed }
    default:
      return state
  }
}
