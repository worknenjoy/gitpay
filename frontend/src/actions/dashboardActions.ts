import axios from "axios";
import { validToken } from "./helpers";
import api from '../consts'

export const DASHBOARD_INFO_REQUEST = 'DASHBOARD_INFO_REQUEST';
export const DASHBOARD_INFO_SUCCESS = 'DASHBOARD_INFO_SUCCESS';
export const DASHBOARD_INFO_FAILURE = 'DASHBOARD_INFO_FAILURE';

const fetchDashboardInfoRequest = () => ({
  type: DASHBOARD_INFO_REQUEST,
});

const fetchDashboardInfoSuccess = (data: any) => ({
  type: DASHBOARD_INFO_SUCCESS,
  payload: data,
});

const fetchDashboardInfoFailure = (error: string) => ({
  type: DASHBOARD_INFO_FAILURE,
  payload: error,
});

export const fetchDashboardInfo = () => {
  validToken();
  return async (dispatch: any) => {
    dispatch(fetchDashboardInfoRequest());
    try {
      const response = await axios.get(`${api.API_URL}/dashboard`);
      if (!response) {
        throw new Error('Network response was not ok');
      }
      const data = await response.data;
      dispatch(fetchDashboardInfoSuccess(data));
    } catch (error: any) {
      dispatch(fetchDashboardInfoFailure(error.message));
    }
  };
}