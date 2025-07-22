import api from "../api/axiosInstance";

export const fetchUserProfile = async () => {
  const response = await api.get('/user/me'); 
  return response.data.user;
};
