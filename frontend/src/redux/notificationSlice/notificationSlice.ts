import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/notifications`;

export interface Notification {
  id: string;
  user_id: string;
  type: "task_assigned" | "task_updated" | "workspace_invite";
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isError: false,
  message: "",
};

const getConfig = (thunkAPI: any) => {
  const state = thunkAPI.getState();
  const token = state.auth.user?.token ?? state.auth.user?.user?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, getConfig(thunkAPI));
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message || "Failed to fetch notifications"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (id: string, thunkAPI) => {
    try {
      await axios.patch(`${API_URL}/${id}/read`, {}, getConfig(thunkAPI));
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message || "Failed to mark notification"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, thunkAPI) => {
    try {
      await axios.patch(`${API_URL}/read-all`, {}, getConfig(thunkAPI));
      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message || "Failed to mark all notifications"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find((notif) => notif.id === action.payload);
        if (notif && !notif.is_read) {
          notif.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((notif) => ({
          ...notif,
          is_read: true,
        }));
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
