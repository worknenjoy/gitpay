import {
  DASHBOARD_INFO_REQUEST,
  DASHBOARD_INFO_SUCCESS,
  DASHBOARD_INFO_FAILURE
 } from '../actions/dashboardActions';

 export const dashboardReducer = (
  state = {
    completed: false,
    data: {},
    error: null,
  },
  action: any
) => {
  switch (action.type) {
    case DASHBOARD_INFO_REQUEST:
      return {
        ...state,
        completed: false,
        error: null,
      };
    case DASHBOARD_INFO_SUCCESS:
      return {
        ...state,
        completed: true,
        data: action.payload,
      };
    case DASHBOARD_INFO_FAILURE:
      return {
        ...state,
        completed: false,
        error: action.payload,
      };
    default:
      return state;
  }
};