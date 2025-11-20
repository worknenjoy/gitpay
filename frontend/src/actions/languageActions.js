import axios from 'axios'
import api from '../consts'

const LIST_LAGUAGE_REQUEST = 'LIST_LANGUAGE_REQUEST'
const LIST_LAGUAGE_SUCCESS = 'LIST_LANGUAGE_SUCCESS'
const LIST_LAGUAGE_ERROR = 'LIST_LANGUAGE_ERROR'

const listLanguageRequested = () => {
  return { type: LIST_LAGUAGE_REQUEST, completed: false }
}

const listLanguageSuccess = (data) => {
  return { type: LIST_LAGUAGE_SUCCESS, completed: true, data }
}

const listLanguageError = (error) => {
  return { type: LIST_LAGUAGE_ERROR, completed: true, error: error }
}

const listLanguage = (params) => {
  return (dispatch) => {
    dispatch(listLanguageRequested())
    return axios
      .get(api.API_URL + '/languages/search', { params })
      .then((languages) => {
        if (languages.status === 200 && languages.data && !languages.data.error) {
          return dispatch(listLanguageSuccess(languages.data))
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error on list labels', error)
        return dispatch(listLanguageError(error))
      })
  }
}

export { LIST_LAGUAGE_REQUEST, LIST_LAGUAGE_SUCCESS, LIST_LAGUAGE_ERROR, listLanguage }
