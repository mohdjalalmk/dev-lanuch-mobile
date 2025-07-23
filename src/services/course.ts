import api from '../api/axiosInstance';
import { Course, GetAllCoursesResponse } from '../utils/types';

export interface EnrolledCourse {
  courseId: Course;
  progress: number;
  enrolledAt: string;
}

export async function getCourses() {
  const response = await api.get('/courses');
  return response.data;
}

export async function getMyEnrolledCourses(): Promise<{
  enrolledCourses: EnrolledCourse[];
}> {
  const response = await api.get<{ enrolledCourses: EnrolledCourse[] }>(
    '/user/me/courses',
  );
  return response.data;
}

export async function getAllCourses({
  search = '',
  page = 1,
  limit = 10,
} = {}): Promise<GetAllCoursesResponse> {
  const response = await api.get<GetAllCoursesResponse>('/courses', {
    params: { search, page, limit },
  });

  return response.data;
}