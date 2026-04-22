import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { CourseDetail } from '../types/course';
import type { ResourceStatus } from './resourceStatus';
import { sessionExpired } from './userSlice';
import { fetchCourseDetailData, logoutUser } from './thunks';

interface CourseState {
  currentCourse: CourseDetail | null;
  currentCourseId: string | null;
  status: ResourceStatus;
  error: ApiErrorResponse | null;
}

const initialState: CourseState = {
  currentCourse: null,
  currentCourseId: null,
  status: 'idle',
  error: null,
};

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseDetailData.pending, (state, action) => {
        state.status = 'loading';
        state.currentCourseId = action.meta.arg;
        state.error = null;
      })
      .addCase(fetchCourseDetailData.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
        state.currentCourseId = action.payload.course.id;
        state.status = 'succeeded';
      })
      .addCase(fetchCourseDetailData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const courseReducer = courseSlice.reducer;
