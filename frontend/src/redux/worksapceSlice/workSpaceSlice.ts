import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL}/workspaces`;


export interface WorkSpace {
  id: string;
  title: string;    
  description: string;
  category: string;
  visibility: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}   

interface WorkspacesState {
  workspaces: WorkSpace[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: WorkspacesState = {
  workspaces: [],
  isError: false,
  isSuccess: false, 
  isLoading: false,         
  message: "",
};

// --- ACTIONS ASYNCHRONES ---

export const fetchWorkspaces = createAsyncThunk(
  'workspaces/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const createWorkspace = createAsyncThunk(
  'workspaces/create',
  async (workspaceData: Partial<WorkSpace>, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, workspaceData);
      return response.data;
    } catch (error: any) {    
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
)



export const workspaceSlice = createSlice({
  name: 'workspaces',
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
      .addCase(fetchWorkspaces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspaces.push(action.payload);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });



    }
  });

console.log('Content of workspaceSlice.actions:', workspaceSlice.actions);

export const { reset } = workspaceSlice.actions;
export default workspaceSlice.reducer;