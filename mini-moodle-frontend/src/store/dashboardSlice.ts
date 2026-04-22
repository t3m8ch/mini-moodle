import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { DashboardData } from '../types/assignment';
import type { ResourceStatus } from './resourceStatus';
import { sessionExpired } from './userSlice';
import { fetchDashboardData, logoutUser } from './thunks';

interface DashboardState {
  data: DashboardData | null;
  status: ResourceStatus;
  error: ApiErrorResponse | null;
}

const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const dashboardReducer = dashboardSlice.reducer;
