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
);