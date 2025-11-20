import { JOIN_TEAM_REQUESTED, JOIN_TEAM_SUCCESS, JOIN_TEAM_ERROR } from '../actions/teamActions'

export const team = (state = { completed: true }, action) => {
  switch (action.type) {
    case JOIN_TEAM_REQUESTED:
      return { ...state, completed: false }
    case JOIN_TEAM_SUCCESS:
      return { ...state, completed: true }
    case JOIN_TEAM_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}
