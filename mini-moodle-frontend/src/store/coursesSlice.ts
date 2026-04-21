import { createSlice } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import type { ApiErrorResponse } from '../api/client';
import type {
  Assignment,
  AssignmentStatus,
  DashboardData,
} from '../types/assignment';
import type { CourseDetail } from '../types/course';
import {
  createAssignmentSubmission,
  deleteAssignmentSubmission,
  fetchCourseDetailData,
  fetchDashboardData,
  logoutUser,
  saveProfileData,
  updateAssignmentSubmission,
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

function replaceAssignmentIfChanged(
  assignments: Assignment[],
  updatedAssignment: Assignment,
) {
  const index = assignments.findIndex(
    (assignment) => assignment.id === updatedAssignment.id,
  );

  if (index === -1) {
    return assignments;
  }

  if (shallowEqual(assignments[index], updatedAssignment)) {
    return assignments;
  }

  const nextAssignments = [...assignments];
  nextAssignments[index] = updatedAssignment;
  return nextAssignments;
}

function patchDashboardProgress(
  dashboard: DashboardData,
  assignmentId: string,
  nextStatus: AssignmentStatus,
) {
  const previousAssignment = dashboard.recentAssignments.find(
    (assignment) => assignment.id === assignmentId,
  );

  if (!previousAssignment || previousAssignment.status === nextStatus) {
    return dashboard.progress;
  }

  const progress = { ...dashboard.progress };

  decrementProgressBucket(progress, previousAssignment.status);
  incrementProgressBucket(progress, nextStatus);

  return progress;
}

function decrementProgressBucket(
  progress: DashboardData['progress'],
  status: AssignmentStatus,
) {
  switch (status) {
    case 'in_progress':
      progress.inProgressCount = Math.max(0, progress.inProgressCount - 1);
      break;
    case 'submitted':
      progress.submittedCount = Math.max(0, progress.submittedCount - 1);
      break;
    case 'graded':
      progress.gradedCount = Math.max(0, progress.gradedCount - 1);
      break;
    case 'not_started':
      break;
  }
}

function incrementProgressBucket(
  progress: DashboardData['progress'],
  status: AssignmentStatus,
) {
  switch (status) {
    case 'in_progress':
      progress.inProgressCount += 1;
      break;
    case 'submitted':
      progress.submittedCount += 1;
      break;
    case 'graded':
      progress.gradedCount += 1;
      break;
    case 'not_started':
      break;
  }
}

function syncAssignmentAcrossCourseCaches(
  state: CoursesState,
  updatedAssignment: Assignment,
) {
  if (state.dashboard) {
    const nextRecentAssignments = replaceAssignmentIfChanged(
      state.dashboard.recentAssignments,
      updatedAssignment,
    );
    const nextProgress = patchDashboardProgress(
      state.dashboard,
      updatedAssignment.id,
      updatedAssignment.status,
    );

    if (
      nextRecentAssignments !== state.dashboard.recentAssignments ||
      nextProgress !== state.dashboard.progress
    ) {
      state.dashboard = {
        ...state.dashboard,
        recentAssignments: nextRecentAssignments,
        progress: nextProgress,
      };
    }
  }

  if (
    state.currentCourse &&
    state.currentCourse.course.id === updatedAssignment.courseId
  ) {
    const nextAssignments = replaceAssignmentIfChanged(
      state.currentCourse.assignments,
      updatedAssignment,
    );

    if (nextAssignments !== state.currentCourse.assignments) {
      state.currentCourse = {
        ...state.currentCourse,
        assignments: nextAssignments,
      };
    }
  }
}

function invalidateLearningCaches(state: CoursesState) {
  state.dashboardStatus = 'idle';
  state.dashboardError = null;
  state.currentCourseStatus = 'idle';
  state.currentCourseError = null;
}

function getCachedAssignment(
  state: CoursesState,
  assignmentId: string,
  courseId: string,
): Assignment | null {
  const currentCourseAssignment =
    state.currentCourse?.course.id === courseId
      ? state.currentCourse.assignments.find(
          (assignment) => assignment.id === assignmentId,
        )
      : undefined;

  if (currentCourseAssignment) {
    return currentCourseAssignment;
  }

  return (
    state.dashboard?.recentAssignments.find(
      (assignment) => assignment.id === assignmentId,
    ) ?? null
  );
}

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
      .addCase(saveProfileData.fulfilled, (state, action) => {
        if (
          state.dashboard &&
          !shallowEqual(state.dashboard.profile, action.payload)
        ) {
          state.dashboard = {
            ...state.dashboard,
            profile: action.payload,
          };
        }
      })
      .addCase(createAssignmentSubmission.fulfilled, (state, action) => {
        syncAssignmentAcrossCourseCaches(state, action.payload.assignment);
        invalidateLearningCaches(state);
      })
      .addCase(updateAssignmentSubmission.fulfilled, (state, action) => {
        syncAssignmentAcrossCourseCaches(state, action.payload.assignment);
        invalidateLearningCaches(state);
      })
      .addCase(deleteAssignmentSubmission.fulfilled, (state, action) => {
        if (!action.payload.assignmentId || !action.payload.courseId) {
          invalidateLearningCaches(state);
          return;
        }

        const cachedAssignment = getCachedAssignment(
          state,
          action.payload.assignmentId,
          action.payload.courseId,
        );

        if (cachedAssignment) {
          syncAssignmentAcrossCourseCaches(state, {
            ...cachedAssignment,
            status: 'not_started',
          });
        }

        invalidateLearningCaches(state);
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const coursesReducer = coursesSlice.reducer;
