// redux/taskSlice/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

// Interfaces based on PostgreSQL response (snake_case)
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  workspace_id: string;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  text: string;
  created_at: string;
  username?: string;
  email?: string;
}

interface TaskState {
  tasks: Task[];
  comments: Comment[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: TaskState = {
  tasks: [],
  comments: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Helper to get token from state
const getConfig = (thunkAPI: any) => {
  const state = thunkAPI.getState();
  const token = state.auth.user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- Async Thunks ---

// Get tasks by workspace
export const fetchTasksByWorkspace = createAsyncThunk(
  "tasks/fetchByWorkspace",
  async (workspaceId: string, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(`${API_URL}/workspace/${workspaceId}`, config);
      return response.data.tasks;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData: { title: string; description?: string; status?: string; workspaceId: string; assignedTo?: string }, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.post(API_URL, taskData, config);
      return response.data.task;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.put(`${API_URL}/${id}`, data, config);
      return response.data.task;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, text }: { taskId: string; text: string }, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.post(`${API_URL}/${taskId}/comments`, { text }, config);
      return response.data.comment;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get comments
export const fetchComments = createAsyncThunk(
  "tasks/fetchComments",
  async (taskId: string, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(`${API_URL}/${taskId}/comments`, config);
      return response.data.comments;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


//get my own tasks
export const fetchOwnTasks = createAsyncThunk(
  "tasks/fetchOwnTasks",
  async (_, thunkAPI) => {  
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(`${API_URL}/my-tasks`, config);
      return response.data.tasks;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearComments: (state) => {
      state.comments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasksByWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(fetchOwnTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOwnTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(fetchOwnTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, clearComments } = taskSlice.actions;
export default taskSlice.reducer;