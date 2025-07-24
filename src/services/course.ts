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

export const getCourseById = async (courseId: string): Promise<Course> => {
  const res = await api.get<{ course: Course }>(`/courses/${courseId}`);
  return res.data.course;
};

export async function enrollInCourse(courseId: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(`/user/courses/enroll/${courseId}`);
  return response.data;
}

export async function getCourseProgress(courseId: string): Promise<{
  courseId: string;
  progress: number;
  completedVideos: Array<{ key: string }>;
}> {
  const response = await api.get(`/user/me/courses/${courseId}/progress`);
  return response.data;
}

export async function updateCourseProgress(courseId: string, videoKey: string): Promise<{
  message: string;
  data: { progress: number; completedVideos: Array<{ key: string }> };
}> {
  const response = await api.patch(`/user/me/courses/${courseId}/?videoKey=${videoKey}`);
  return response.data;
}

export async function getSignedVideoUrl(courseId: string, key: string): Promise<{ signedUrl: string }> {  
  const response = await api.get<{ signedUrl: string }>(`/courses/${courseId}/videos/signed-url`, {
    params: { key }
  });  
  return response.data.url;
}

export const getCourseCertificate = async (courseId: string) => {
  const res = await api.post(`/courses/${courseId}/generate-certificate`);
  return res.data;
}; 

