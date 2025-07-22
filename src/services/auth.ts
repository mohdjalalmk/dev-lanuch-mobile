import api from '../api/axiosInstance';
import { storeToken, removeToken } from '../utils/auth';

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  await storeToken(token);
  return { token, user };
};

export const logout = async () => {
  const resp= await api.post('/auth/logout');  
  await removeToken();
};

export const deleteAccount = async (userId: string) => {
  await api.delete(`/users/${userId}`);
  await removeToken();
};
