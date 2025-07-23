export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  isFree: boolean;
  price: number;
  thumbnail: string;
  creator: { _id: string; name: string };
  isPublished: boolean;
  totalEnrollments: number;
  avgProgress: number;
}

export interface EnrolledCourse {
  courseId: string; 
  progress: number;
  completedVideos: Array<{ key: string }>;
}

export interface GetAllCoursesResponse {
  courses: Course[];
  page: number;
  totalPages: number;
  totalCourses: number;
}

export type CourseProgress = {
  completedVideos: { key: string }[];
  progress: number;
};

export type Video = {
  key: string;
  title: string;
  description?: string;
};

