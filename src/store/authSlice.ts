import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  avatarUrl?: string | null;
  isActive?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
  },
});

export const { setAuth, setUser, setAuthLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
