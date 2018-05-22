const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

const addNotification = (message) => {
  return { type: ADD_NOTIFICATION, text: message, open: true}
}

const closeNotification = () => {
  return { type: CLOSE_NOTIFICATION }
}

export { ADD_NOTIFICATION, CLOSE_NOTIFICATION, addNotification, closeNotification };
