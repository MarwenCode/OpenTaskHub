import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

interface User {
  id: string;
  username: string;
  email: string;
  role: string; // Ajouté pour savoir si c'est un admin ou user
  token?: string;
}

export interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const user = JSON.parse(localStorage.getItem('user') || 'null');

const initialState: AuthState = {
  user: user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- ACTIONS ASYNCHRONES ---

// Register : on attend un objet { data: ..., role: 'admin' | 'user' }
export const register = createAsyncThunk(
  'auth/register',
  async ({ userData, role }: { userData: any; role: 'admin' | 'user' }, thunkAPI) => {
    try {
      // On utilise le role pour taper sur la bonne URL : /register/admin ou /register/user
      const response = await axios.post(`${API_URL}/register/${role}`, userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login : on attend aussi l'identifiant du portail (role)
export const login = createAsyncThunk(
  'auth/login',
  async ({ userData, role }: { userData: any; role: 'admin' | 'user' }, thunkAPI) => {
    try {
      if (userData.token) {
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }

      // On tape sur /login/admin ou /login/user
      const response = await axios.post(`${API_URL}/login/${role}`, userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

// Le reste du slice (reducers/extraReducers) reste identique car la logique d'état ne change pas
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;