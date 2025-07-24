import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';
import { logout } from '../slices/authSlice';
import { API_BASE_URL, } from '@env';

let storeRef: any = null; 

export const injectStore = (_store: any) => {
  storeRef = _store;
};
const api = axios.create({
  baseURL:API_BASE_URL,
  timeout: 10000,
});

// Add token to headers before request
api.interceptors.request.use(
  async config => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Handle response errors globally (optional: for refresh logic)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await removeToken();
        storeRef.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default api;
