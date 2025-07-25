import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../services/user';
import Toast from 'react-native-toast-message';


export const getUserProfile = createAsyncThunk('user/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await fetchUserProfile();
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Profile Fetch Failed',
      text2: error.response?.data?.message || 'Failed to fetch user profile.',
    });
  }
});


const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    user: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserProfile.pending, state => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {        
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default userSlice.reducer;