import api from '../api/axiosInstance';

export async function getCourses() {
  const response = await api.get('/courses');
  return response.data;
}
