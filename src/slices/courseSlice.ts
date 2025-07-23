import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllCourses, getMyEnrolledCourses } from '../services/course';
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

interface CourseState {
  allCourses: any[];
  groupedCourses: any[];
  enrolledCourseIds: string[];
  loading: boolean;
}

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    enrolledCourses: [],
    allCourses: [],
    groupedCourses: [],
    enrolledCourseIds: [],
    loading: false,
    error: '',
  } as CourseState & { enrolledCourses: any[]; error: string },
  reducers: {},
  extraReducers: builder => {
    builder
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

export default courseSlice.reducer;
