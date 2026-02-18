// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './authSlice/authSlice';
import workspaceReducer from './worksapceSlice/workSpaceSlice';
import taskReducer from './taskSlice/taskSlice';
import notificationReducer from './notificationSlice/notificationSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    task: taskReducer,
    notification: notificationReducer,
    
    
  },
});

// Types de base
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;