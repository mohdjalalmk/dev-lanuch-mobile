import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  enrollInCourse,
  getAllCourses,
  getCourseById,
  getCourseProgress,
  getMyEnrolledCourses,
  getSignedVideoUrl,
  updateCourseProgress,
} from '../services/course';
import { groupByCategory } from '../utils/groupByCategory';

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolled',
  async (_, thunkAPI) => {
    try {
      return await getMyEnrolledCourses();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to load courses',
      );
    }
  },
);

export const fetchCoursesThunk = createAsyncThunk(
  'courses/fetchCourses',
  async (search: string = '', thunkAPI) => {
    try {
      const response = await getAllCourses({ search, page: 1, limit: 10 });
      return response.courses;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to load courses',
      );
    }
  },
);

export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await getCourseById(courseId);
    } catch (error) {
      console.error('Error fetching course:', error);
      return rejectWithValue('Failed to fetch course details.');
    }
  },
);

export const fetchCourseProgress = createAsyncThunk(
  'course/fetchCourseProgress',
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await getCourseProgress(courseId);
    } catch (error) {
    }
  },
);

export const enrollCourse = createAsyncThunk(
  'course/enroll',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await enrollInCourse(courseId);
      return true;
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  },
);

export const toggleVideoCompletion = createAsyncThunk(
  'course/toggleVideoCompletion',
  async (
    { courseId, videoKey }: { courseId: string; videoKey: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const updated = await updateCourseProgress(courseId, videoKey);
      dispatch(fetchCourseProgress(courseId));

      return updated;
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  },
);

export const fetchSignedVideoUrl = createAsyncThunk(
  'course/fetchSignedVideoUrl',
  async (
    { courseId, videoKey }: { courseId: string; videoKey: string },
    { rejectWithValue },
  ) => {
    try {
      return await getSignedVideoUrl(courseId, videoKey);
    } catch (error) {
      console.error('Error fetching signed video URL:', error);
    }
  },
);

interface CourseState {
  allCourses: any[];
  groupedCourses: any[];
  loading: boolean;
  error?: string | null;
  course?: any;
  selectedVideo?: any;
  signedVideoUrl?: any;
  progress?: any;
  completedVideoKeys?: string[];
  enrolledCourses?: any[];
  enrolledCourseIds?: string[];
  enrolled?: boolean;
}

const initialState: CourseState = {
  allCourses: [],
  groupedCourses: [],
  enrolledCourses: [],
  loading: false,
  error: null,
  course: undefined,
  selectedVideo: undefined,
  signedVideoUrl: undefined,
  progress: undefined,
  enrolledCourseIds: [],
  completedVideoKeys: [],
  enrolled: false,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    selectVideo(state, action) {
      state.selectedVideo = action.payload;
    },
   resetCourseState(state) {
    state.course = undefined;
    state.selectedVideo = undefined;
    state.signedVideoUrl = undefined;
    state.progress = undefined;
    state.completedVideoKeys = [];
    state.enrolled = false;
  },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCourseById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.course = action.payload;
        state.selectedVideo = action.payload.videos[0];
        state.loading = false;

        const currentId = action.payload._id;
        state.enrolled = state.enrolledCourses?.some(
          c => c.courseId._id === currentId,
        );
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Failed to fetch course.';
      })

      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload.progress || 0;
        state.completedVideoKeys = action.payload.completedVideos.map(
          v => v.key,
        );
      })

      .addCase(enrollCourse.fulfilled, state => {
        state.enrolled = true;
      })
      .addCase(toggleVideoCompletion.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(toggleVideoCompletion.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(toggleVideoCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload.progress;
        state.completedVideoKeys = action.payload.completedVideos.map(
          v => v.key,
        );
      })

      .addCase(fetchSignedVideoUrl.fulfilled, (state, action) => {
        state.signedVideoUrl = action.payload;
      })
      .addCase(fetchEnrolledCourses.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload
          .enrolledCourses as typeof state.enrolledCourses;
        state.loading = false;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchCoursesThunk.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
        state.allCourses = action.payload;
        state.groupedCourses = groupByCategory(action.payload);
        state.loading = false;
      })
      .addCase(fetchCoursesThunk.rejected, state => {
        state.loading = false;
      });
  },
});
export const { selectVideo, resetCourseState } = courseSlice.actions;

export default courseSlice.reducer;
