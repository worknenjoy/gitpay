import api from '../consts'
import axios from 'axios'

import { addNotification } from './notificationActions'
import { fetchTask } from './taskActions'

const ASSIGN_TASK_REQUESTED = 'ASSIGN_TASK_REQUESTED'
const ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS'
const ASSIGN_TASK_ERROR = 'ASSIGN_TASK_ERROR'

const assignTaskRequested = () => {
  return { type: ASSIGN_TASK_REQUESTED, completed: false }
}

const assignTaskSuccess = tab => {
  return { type: ASSIGN_TASK_SUCCESS, completed: true, tab: tab }
}

const assignTaskError = error => {
  return { type: ASSIGN_TASK_ERROR, completed: true, error: error }
}

const assignTask = (taskId, assignId) => {
  return dispatch => {
    dispatch(assignTaskRequested())
    axios
      .put(api.API_URL + '/tasks/update', {
        id: taskId,
        assigned: assignId
      })
      .then(response => {
        dispatch(addNotification('Tarefa atualizada com sucesso!'))
        dispatch(assignTaskSuccess(2))
        return dispatch(fetchTask(taskId))
      })
      .catch(error => {
        dispatch(addNotification('Não foi possível atualizar tarefa.'))
        return dispatch(assignTaskError(error))
      })
  }
}

export {
  ASSIGN_TASK_REQUESTED,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_ERROR,
  assignTask
}
