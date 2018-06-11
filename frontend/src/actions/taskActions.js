import api from '../consts';
import axios from 'axios';
import { addNotification } from './notificationActions';

const CREATE_TASK_REQUESTED = 'CREATE_TASK_REQUESTED';
const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
const CREATE_TASK_ERROR = 'CREATE_TASK_ERROR';

const UPDATE_TASK_REQUESTED = 'UPDATE_TASK_REQUESTED';
const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
const UPDATE_TASK_ERROR = 'UPDATE_TASK_ERROR';

const FETCH_TASK_REQUESTED = 'FETCH_TASK_REQUESTED';
const FETCH_TASK_SUCCESS = 'FETCH_TASK_SUCCESS';
const FETCH_TASK_ERROR = 'FETCH_TASK_ERROR';

const PAYMENT_TASK_REQUESTED = 'PAYMENT_TASK_REQUESTED';
const PAYMENT_TASK_SUCCESS = 'PAYMENT_TASK_SUCCESS';
const PAYMENT_TASK_ERROR = 'PAYMENT_TASK_ERROR';

const CHANGE_TASK_TAB = 'CHANGE_TASK_TAB';

const VALIDATION_ERRORS = {
  "url must be unique": 'Essa url já foi cadastrada'
}

/*
 *
 * Task
 *
 */

const createTaskRequested = () => {
  return { type: CREATE_TASK_REQUESTED, completed: false }
}

const createTaskSuccess = () => {
  return { type: CREATE_TASK_SUCCESS, completed: true }
}

const createTaskError = (error) => {
  return { type: CREATE_TASK_ERROR, completed: true, error: error }
}

const updateTaskRequested = () => {
  return { type: UPDATE_TASK_REQUESTED, completed: false }
}

const updateTaskSuccess = (field) => {
  return { type: UPDATE_TASK_SUCCESS, completed: true, tab: field }
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

const paymentTaskRequested = () => {
  return { type: PAYMENT_TASK_REQUESTED, completed: false }
}

const paymentTaskSuccess = (payment) => {
  return { type: PAYMENT_TASK_SUCCESS, completed: true, data: payment.data}
}

const paymentTaskError = (error) => {
  return { type: CREATE_TASK_ERROR, completed: true, error: error }
}

const changeTaskTab = (tab) => {
  return { type: CHANGE_TASK_TAB, tab: tab }
}

const createTask = (task, history) => {
  return (dispatch) => {
    dispatch(createTaskRequested())
    axios.post(api.API_URL + '/tasks/create', task).then((response) => {
      if(response.data && response.data.errors) {
        dispatch(addNotification(VALIDATION_ERRORS[response.data.errors[0].message]));
        return dispatch(createTaskError(response.data.errors));
      }
      dispatch(createTaskSuccess());
      dispatch(addNotification('Tarefa criada com sucesso'));
      history.push(`/task/${response.data.id}`);
      return dispatch(fetchTask(response.data.id));
    }).catch((error) => {
      console.log(error);
      dispatch(addNotification('Erro ao atualizar tarefa'));
      return dispatch(createTaskError(error));
    });
  }
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
      if(task.Orders) {
        dispatch(updateTaskSuccess(1));
      } else if(task.Assigns) {
        dispatch(updateTaskSuccess(2));
      } else {
        dispatch(updateTaskSuccess(0));
      }
      dispatch(addNotification('Tarefa atualizada com sucesso'));
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

const paymentTask = (taskId) => {
  return (dispatch) => {
    dispatch(paymentTaskRequested())
    const userId = getState().loggedIn.user.id;
    if(!userId) {
      dispatch(addNotification('Você precisa estar logado'));
      return dispatch(paymentTaskError({ message: 'Você precisa estar logado' }));
    }
    axios.post(`${api.API_URL}/tasks/payments/`,{
      taskId: taskId
    }).then((payment) => {
      console.log(payment)
      return dispatch(paymentTaskSuccess(payment));
    }).catch((e) => {
      dispatch(addNotification('Não foi possível realizar o pagamento para esta tarefa'));
      dispatch(paymentTaskError(e));
      console.log('not possible to pay task');
      console.log(e);
    });
  }
}

export {
  CREATE_TASK_REQUESTED,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
  UPDATE_TASK_REQUESTED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_ERROR,
  FETCH_TASK_REQUESTED,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR,
  PAYMENT_TASK_REQUESTED,
  PAYMENT_TASK_SUCCESS,
  PAYMENT_TASK_ERROR,
  CHANGE_TASK_TAB,
  addNotification,
  createTask,
  fetchTask,
  updateTask,
  paymentTask,
  changeTaskTab
};

