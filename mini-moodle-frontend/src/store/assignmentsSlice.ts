import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { AssignmentDetail, ProgressEntry } from '../types/assignment';
import {
  createAssignmentSubmission,
  deleteAssignmentSubmission,
  fetchAssignmentDetailData,
  fetchProgressData,
  logoutUser,
  updateAssignmentSubmission,
} from './thunks';

export type ResourceStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface AssignmentsState {
  currentAssignment: AssignmentDetail | null;
  currentAssignmentId: string | null;
  currentAssignmentStatus: ResourceStatus;
  currentAssignmentError: ApiErrorResponse | null;
  progress: ProgressEntry[];
  progressStatus: ResourceStatus;
  progressError: ApiErrorResponse | null;
}

const initialState: AssignmentsState = {
  currentAssignment: null,
  currentAssignmentId: null,
  currentAssignmentStatus: 'idle',
  currentAssignmentError: null,
  progress: [],
  progressStatus: 'idle',
  progressError: null,
};

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentDetailData.pending, (state, action) => {
        state.currentAssignmentStatus = 'loading';
        state.currentAssignmentId = action.meta.arg;
        state.currentAssignmentError = null;
      })
      .addCase(fetchAssignmentDetailData.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
        state.currentAssignmentStatus = 'succeeded';
        state.currentAssignmentId = action.payload.assignment.id;
      })
      .addCase(fetchAssignmentDetailData.rejected, (state, action) => {
        state.currentAssignmentStatus = 'failed';
        state.currentAssignmentError = action.payload ?? null;
      })
      .addCase(fetchProgressData.pending, (state) => {
        state.progressStatus = 'loading';
        state.progressError = null;
      })
      .addCase(fetchProgressData.fulfilled, (state, action) => {
        state.progress = action.payload;
        state.progressStatus = 'succeeded';
      })
      .addCase(fetchProgressData.rejected, (state, action) => {
        state.progressStatus = 'failed';
        state.progressError = action.payload ?? null;
      })
      .addCase(createAssignmentSubmission.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
        state.currentAssignmentStatus = 'succeeded';
        state.currentAssignmentId = action.payload.assignment.id;
        state.progressStatus = 'idle';
      })
      .addCase(updateAssignmentSubmission.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
        state.currentAssignmentStatus = 'succeeded';
        state.currentAssignmentId = action.payload.assignment.id;
        state.progressStatus = 'idle';
      })
      .addCase(deleteAssignmentSubmission.fulfilled, (state) => {
        if (state.currentAssignment) {
          state.currentAssignment = {
            ...state.currentAssignment,
            assignment: {
              ...state.currentAssignment.assignment,
              status: 'not_started',
            },
            submission: null,
          };
        }

        state.progressStatus = 'idle';
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const assignmentsReducer = assignmentsSlice.reducer;
