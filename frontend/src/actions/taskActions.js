import api from '../consts';
import axios from 'axios';
import { addNotification } from './notificationActions';

const UPDATE_TASK_REQUESTED = 'UPDATE_TASK_REQUESTED';
const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR';

const FETCH_TASK_REQUESTED = 'FETCH_TASK_REQUESTED';
const FETCH_TASK_SUCCESS = 'FETCH_TASK_SUCCESS';
const FETCH_TASK_ERROR = 'FETCH_TASK_ERROR';

/*
 *
 * Task
 *
 */

const updateTaskRequested = () => {
  return { type: UPDATE_TASK_REQUESTED, completed: false }
}

const updateTaskSuccess = () => {
  return { type: UPDATE_TASK_SUCCESS, completed: true }
}

const updateTaskError = (error) => {
  return { type: UPDATE_TASK_ERROR, completed: true, error: error }
}

const fetchTaskRequested = () => {
  return { type: FETCH_TASK_REQUESTED, completed: false }
}

const fetchTaskSuccess = (task) => {
  return { type: FETCH_TASK_SUCCESS, completed: true, data: task.data }
}

const fetchTaskError = (error) => {
  return { type: FETCH_TASK_ERROR, completed: true, error: error }
}

const updateTask = (task) => {
  return (dispatch, getState) => {
    dispatch(updateTaskRequested())
    const userId = getState().loggedIn.user.id;
    if(!userId) {
      dispatch(addNotification('Você precisa estar logado'));
      return dispatch(updateTaskError({ message: 'Você precisa estar logado' }));
    }
    axios.put(api.API_URL + '/tasks/update', task).then((response) => {
      dispatch(addNotification('Tarefa atualizada com sucesso'));
      dispatch(updateTaskSuccess());
      return dispatch(fetchTask(task.id));
    }).catch((error) => {
      console.log(error);
      dispatch(addNotification('Erro ao atualizar tarefa'));
      return dispatch(updateTaskError(error));
    });
  }
}

const fetchTask = (taskId) => {
  return (dispatch) => {
    dispatch(fetchTaskRequested())
    axios.get(api.API_URL + `/tasks/fetch/${taskId}`).then((task) => {
      return dispatch(fetchTaskSuccess(task));
    }).catch((e) => {
      dispatch(addNotification('Não foi possível obter esta tarefa, por favor tente novamente mais tarde'));
      dispatch(fetchTaskError(e));
      console.log('not possible to fetch issue');
      console.log(e);
    });
  }
}

export {
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  FETCH_TASK_REQUESTED,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR,
  addNotification,
  fetchTask,
  updateTask
};

