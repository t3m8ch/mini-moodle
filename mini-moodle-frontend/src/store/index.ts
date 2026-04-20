import { configureStore } from '@reduxjs/toolkit';
import { assignmentsReducer } from './assignmentsSlice';
import { coursesReducer } from './coursesSlice';
import { profileReducer } from './profileSlice';
import { settingsReducer } from './settingsSlice';
import { userReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    settings: settingsReducer,
    courses: coursesReducer,
    assignments: assignmentsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
