import api from '../consts'
import axios from 'axios'

const GET_MAINTAINED_PROJECTS_REQUESTED = 'GET_MAINTAINED_PROJECTS_REQUESTED'
const GET_MAINTAINED_PROJECTS_SUCCESS = 'GET_MAINTAINED_PROJECTS_SUCCESS'
const GET_MAINTAINED_PROJECTS_ERROR = 'GET_MAINTAINED_PROJECTS_ERROR'

/*
  Fetch a user's maintained projects (org + rollups) for the Maintainer profile page
*/

const getMaintainedProjectsRequested = () => {
  return { type: GET_MAINTAINED_PROJECTS_REQUESTED, completed: false }
}

const getMaintainedProjectsSuccess = (data) => {
  return { type: GET_MAINTAINED_PROJECTS_SUCCESS, completed: true, data }
}

const getMaintainedProjectsError = (error) => {
  return { type: GET_MAINTAINED_PROJECTS_ERROR, completed: true, error: error }
}

const getMaintainedProjects = (userId) => {
  return (dispatch) => {
    dispatch(getMaintainedProjectsRequested())
    return axios
      .get(api.API_URL + `/users/${userId}/maintained-projects`)
      .then((response) => {
        return dispatch(getMaintainedProjectsSuccess(response.data))
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('get maintained projects error', e)
        return dispatch(getMaintainedProjectsError(e))
      })
  }
}

export {
  GET_MAINTAINED_PROJECTS_REQUESTED,
  GET_MAINTAINED_PROJECTS_SUCCESS,
  GET_MAINTAINED_PROJECTS_ERROR,
  getMaintainedProjects
}
