import {
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { assignmentReducer } from './assignmentSlice';
import { courseReducer } from './courseSlice';
import { dashboardReducer } from './dashboardSlice';
import { profileReducer } from './profileSlice';
import { progressReducer } from './progressSlice';
import { settingsReducer } from './settingsSlice';
import { userReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    settings: settingsReducer,
    dashboard: dashboardReducer,
    course: courseReducer,
    assignment: assignmentReducer,
    progress: progressReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
