import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { AssignmentDetail } from '../types/assignment';
import type { ResourceStatus } from './resourceStatus';
import { sessionExpired } from './userSlice';
import { fetchAssignmentDetailData, logoutUser } from './thunks';

interface AssignmentState {
  currentAssignment: AssignmentDetail | null;
  currentAssignmentId: string | null;
  status: ResourceStatus;
  error: ApiErrorResponse | null;
}

const initialState: AssignmentState = {
  currentAssignment: null,
  currentAssignmentId: null,
  status: 'idle',
  error: null,
};

export const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentDetailData.pending, (state, action) => {
        state.status = 'loading';
        state.currentAssignmentId = action.meta.arg;
        state.error = null;
      })
      .addCase(fetchAssignmentDetailData.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
        state.currentAssignmentId = action.payload.assignment.id;
        state.status = 'succeeded';
      })
      .addCase(fetchAssignmentDetailData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const assignmentReducer = assignmentSlice.reducer;
