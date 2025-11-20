import axios from 'axios'
import api from '../consts'

const LIST_LABELS_REQUEST = 'LIST_LABELS_REQUEST'
const LIST_LABELS_SUCCESS = 'LIST_LABELS_SUCCESS'
const LIST_LABELS_ERROR = 'LIST_LABELS_ERROR'

const listLabelsRequested = () => {
  return { type: LIST_LABELS_REQUEST, completed: false }
}

const listLabelsSuccess = (data) => {
  return { type: LIST_LABELS_SUCCESS, completed: true, data }
}

const listLabelsError = (error) => {
  return { type: LIST_LABELS_ERROR, completed: true, error: error }
}

const listLabels = (params) => {
  return (dispatch) => {
    dispatch(listLabelsRequested())
    return axios
      .get(api.API_URL + '/labels/search', { params })
      .then((labels) => {
        if (labels.status === 200 && labels.data && !labels.data.error) {
          return dispatch(listLabelsSuccess(labels.data))
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error on list labels', error)
        return dispatch(listLabelsError(error))
      })
  }
}

export { LIST_LABELS_REQUEST, LIST_LABELS_SUCCESS, LIST_LABELS_ERROR, listLabels }
