import axios from 'axios'
import api from '../consts'

const FETCH_LANGUAGE_REQUESTED = 'FETCH_LANGUAGE_REQUESTED'
const FETCH_LANGUAGE_SUCCESS = 'FETCH_LANGUAGE_SUCCESS'
const FETCH_LANGUAGE_ERROR = 'FETCH_LANGUAGE_ERROR'

const fetchLangRequested = () => {
  return { type: FETCH_LANGUAGE_REQUESTED, completed: false }
}

const fetchLangSuccess = (response) => {
  return { type: FETCH_LANGUAGE_SUCCESS, completed: true, lang: response.data.lang }
}

const fetchLangError = (error) => {
  return { type: FETCH_LANGUAGE_ERROR, completed: true, error }
}

const fetchLanguage = () => {
  return (dispatch) => {
    dispatch(fetchLangRequested())
    return axios
      .get(api.API_URL + '/user/1/languages')
      .then(response => {
        //console.log('response', response.data)
        return dispatch(fetchLangSuccess(response.data))
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        return dispatch(fetchLangError(error))
      })
  }
}

export {
  FETCH_LANGUAGE_REQUESTED,
  FETCH_LANGUAGE_SUCCESS,
  FETCH_LANGUAGE_ERROR,
  fetchLangRequested,
  fetchLangSuccess,
  fetchLangError,
  fetchLanguage
}
