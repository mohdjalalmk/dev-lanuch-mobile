import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { deleteAccount, login, logout } from '../services/auth';

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  isBootstrapped: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isLoggedIn: false,
  isBootstrapped: false,
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const data = await login(credentials);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    await logout();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

export const deleteUser = createAsyncThunk('auth/deleteUser', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const userId = state.auth.user?._id;
    if (!userId) throw new Error('User not found');
    await deleteAccount(userId);
    return true;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.isBootstrapped = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.isLoggedIn = !!action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(logoutUser.fulfilled, state => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    });

    builder
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, state => {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBootstrapped,setToken } = authSlice.actions;
export default authSlice.reducer;
