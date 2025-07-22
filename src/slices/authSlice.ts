// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  isBootstrapped: boolean;
  user: any | null;
}

const initialState: AuthState = {
  token: null,
  isLoggedIn: false,
  isBootstrapped: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.isBootstrapped = action.payload;
    },
    login(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
  },
});

export const { setToken, logout, login, setBootstrapped } = authSlice.actions;
export default authSlice.reducer;
