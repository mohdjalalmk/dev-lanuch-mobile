import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMyEnrolledCourses } from '../services/course';

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolled',
  async (_, thunkAPI) => {
    try {
      return await getMyEnrolledCourses();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load courses');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    enrolledCourses: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEnrolledCourses.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload.enrolledCourses as typeof state.enrolledCourses;
        state.loading = false;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default courseSlice.reducer;
