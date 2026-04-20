import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { DashboardData } from '../types/assignment';
import type { CourseDetail } from '../types/course';
import {
  fetchCourseDetailData,
  fetchDashboardData,
  logoutUser,
} from './thunks';

export type ResourceStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface CoursesState {
  dashboard: DashboardData | null;
  dashboardStatus: ResourceStatus;
  dashboardError: ApiErrorResponse | null;
  currentCourse: CourseDetail | null;
  currentCourseId: string | null;
  currentCourseStatus: ResourceStatus;
  currentCourseError: ApiErrorResponse | null;
}

const initialState: CoursesState = {
  dashboard: null,
  dashboardStatus: 'idle',
  dashboardError: null,
  currentCourse: null,
  currentCourseId: null,
  currentCourseStatus: 'idle',
  currentCourseError: null,
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardStatus = 'loading';
        state.dashboardError = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.dashboardStatus = 'succeeded';
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.dashboardStatus = 'failed';
        state.dashboardError = action.payload ?? null;
      })
      .addCase(fetchCourseDetailData.pending, (state, action) => {
        state.currentCourseStatus = 'loading';
        state.currentCourseId = action.meta.arg;
        state.currentCourseError = null;
      })
      .addCase(fetchCourseDetailData.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
        state.currentCourseStatus = 'succeeded';
        state.currentCourseId = action.payload.course.id;
      })
      .addCase(fetchCourseDetailData.rejected, (state, action) => {
        state.currentCourseStatus = 'failed';
        state.currentCourseError = action.payload ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const coursesReducer = coursesSlice.reducer;
