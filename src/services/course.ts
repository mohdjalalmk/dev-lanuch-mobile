import api from '../api/axiosInstance';


export interface Course {
  _id: string;
  title: string;
  thumbnail: string;
}

export interface EnrolledCourse {
  courseId: Course;
  progress: number;
  enrolledAt: string;
}


export async function getCourses() {
  const response = await api.get('/courses');
  return response.data;
}


export async function getMyEnrolledCourses(): Promise<{ enrolledCourses: EnrolledCourse[] }> {
  const response = await api.get<{ enrolledCourses: EnrolledCourse[] }>(
    '/user/me/courses',
  );  
  return response.data;
}
