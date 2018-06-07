import api from '../consts';
import axios from 'axios';
import { addNotification } from './notificationActions';

const UPDATE_TASK_REQUESTED = 'UPDATE_TASK_REQUESTED';
const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR';

/*
 *
 * Task
 *
 */

const updateTaskRequested = () => {
  return { type: UPDATE_TASK_REQUESTED, completed: false }
}

const updateTaskSuccess = (task) => {
  return { type: UPDATE_TASK_SUCCESS, completed: true, task: task }
}

const updateTaskError = (error) => {
  return { type: UPDATE_TASK_SUCCESS, completed: true, error: error }
}

const updateTask = (task) => {
  return (dispatch, getState) => {
    const userId = getState().loggedIn.user.id;
    if(!userId) {
      dispatch(addNotification('Você precisa estar logado'));
      return dispatch(updateTaskError({ message: 'Você precisa estar logado' }));
    }
    axios.put(api.API_URL + '/tasks/update', task).then((response) => {
      dispatch(addNotification('Tarefa atualizada com sucesso'));
      return dispatch(updateTaskSuccess(response));
    }).catch((error) => {
      dispatch(addNotification('Erro ao atualizar tarefa'));
      return dispatch(updateTaskError(error));
    });
  }
}

export {
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  addNotification,
  updateTask
};

