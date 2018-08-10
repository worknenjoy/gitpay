import axios from 'axios'
import api from '../consts'

const INFO_REQUESTED = 'INFO_REQUESTED'
const INFO_SUCCESS = 'INFO_SUCCESS'
const INFO_ERROR = 'INFO_ERROR'

const infoRequested = () => {
  return { type: INFO_REQUESTED, completed: false }
}

const infoSuccess = info => {
  return { type: INFO_SUCCESS, completed: true, data: info.data }
}

const infoError = error => {
  return { type: INFO_ERROR, completed: true, error: error }
}

const info = () => {
  return (dispatch) => {
    dispatch(infoRequested())
    axios
      .get(api.API_URL + '/info/all')
      .then(response => {
        return dispatch(infoSuccess(response))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        return dispatch(infoError(error))
      })
  }
}

export {
  INFO_REQUESTED,
  INFO_SUCCESS,
  INFO_ERROR,
  info
}
