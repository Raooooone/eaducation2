import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Thunk pour login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/login', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

// Thunk pour signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/register', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = 'succeeded';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
