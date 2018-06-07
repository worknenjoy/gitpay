import api from '../consts';
import axios from 'axios';

import { addNotification } from './notificationActions';

const ASSIGN_TASK_REQUESTED = 'ASSIGN_TASK_REQUESTED';
const ASSIGN_TASK_SUCCESS = 'ASSIGN_TASK_SUCCESS';
const ASSIGN_TASK_ERROR = 'ASSIGN_TASK_ERROR';

const assignTaskRequested = () => {
  return { type: ASSIGN_TASK_REQUESTED, completed: false }
}

const assignTaskSuccess = (task) => {
  return { type: ASSIGN_TASK_SUCCESS, completed: true, task: task }
}

const assignTaskError = (error) => {
  return { type: ASSIGN_TASK_ERROR, completed: true, error: error }
}

const assignTask = (taskId, assignId) => {
  return (dispatch) => {
    dispatch(assignTaskRequested());
    axios.put(api.API_URL + '/tasks/update', {
      id: taskId,
      assigned: assignId
    }).then((response) => {
      dispatch(addNotification('Tarefa atualizada com sucesso'));
      return dispatch(assignTaskSuccess(response));
    }).catch((error) => {
      dispatch(addNotification('Erro ao atualizar tarefa'));
      return dispatch(assignTaskError(error));
    });
  }
}

export {
 ASSIGN_TASK_REQUESTED,
 ASSIGN_TASK_SUCCESS,
 ASSIGN_TASK_ERROR,
 assignTask
};

