import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { ProgressEntry } from '../types/assignment';
import type { ResourceStatus } from './resourceStatus';
import { fetchProgressData, logoutUser } from './thunks';

interface ProgressState {
  entries: ProgressEntry[];
  status: ResourceStatus;
  error: ApiErrorResponse | null;
}

const initialState: ProgressState = {
  entries: [],
  status: 'idle',
  error: null,
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgressData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgressData.fulfilled, (state, action) => {
        state.entries = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProgressData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const progressReducer = progressSlice.reducer;
