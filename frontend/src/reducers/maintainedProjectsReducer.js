import {
  GET_MAINTAINED_PROJECTS_REQUESTED,
  GET_MAINTAINED_PROJECTS_SUCCESS,
  GET_MAINTAINED_PROJECTS_ERROR
} from '../actions/maintainedProjectsActions'

export const maintainedProjects = (state = { data: [], completed: true, error: {} }, action) => {
  switch (action.type) {
    case GET_MAINTAINED_PROJECTS_REQUESTED:
      return { ...state, completed: false }
    case GET_MAINTAINED_PROJECTS_SUCCESS:
      return { ...state, completed: true, data: action.data, error: {} }
    case GET_MAINTAINED_PROJECTS_ERROR:
      return { ...state, completed: true, error: action.error }
    default:
      return state
  }
}

export default maintainedProjects
