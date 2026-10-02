import { updateTaskApi } from '../api/taskApi';
import { TASK_UPDATE_SUCCESS, SYNC_TASK_SUCCESS } from '../constants/actionTypes';
import { notify } from '../utils/notifications';

export const updateTask = (taskId, updateData) => async (dispatch) => {
  try {
    const response = await updateTaskApi(taskId, updateData);
    const { task, order } = response.data;

    // Atualiza o estado da task com os dados já sincronizados vindos do BE
    dispatch({
      type: TASK_UPDATE_SUCCESS,
      payload: task,
    });

    // Se o backend retornou uma nova ordem, notificamos o usuário
    if (order) {
      notify('Payment order created successfully!', 'success');
    }

    // REMOVIDO: dispatch(fetchTask(taskId))
    // REMOVIDO: dispatch(syncTask(taskId))
    // A lógica de sincronização agora é feita no backend e retornada no payload da task

    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    notify('Failed to update task', 'error');
    throw error;
  }
};
