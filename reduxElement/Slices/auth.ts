import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isSignup: boolean;
  isLoggedIn: boolean;
  adminEmail: string;
}

const initialState: AuthState = {
  isSignup: false,
  isLoggedIn: false,
  adminEmail: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSignup: (state, action: PayloadAction<boolean>) => {
      state.isSignup = action.payload;
    },
    setLogin: (state, action: PayloadAction<{ email: string }>) => {
      state.isLoggedIn = true;
      state.adminEmail = action.payload.email;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.adminEmail = '';
    },
    setAdminemail: (state, action: PayloadAction<string>) => {
      state.adminEmail = action.payload;
    },
  },
});

export const { setIsSignup, setLogin, logout, setAdminemail } = authSlice.actions;
export default authSlice.reducer;
