import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectSessionStatus = (state: RootState) =>
  state.user.sessionStatus;

export const selectDashboard = (state: RootState) => state.dashboard.data;
export const selectDashboardStatus = (state: RootState) =>
  state.dashboard.status;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export const selectCurrentCourseDetail = (state: RootState) =>
  state.course.currentCourse;
export const selectCurrentCourseStatus = (state: RootState) =>
  state.course.status;
export const selectCurrentCourseError = (state: RootState) =>
  state.course.error;
export const selectCurrentCourseId = (state: RootState) =>
  state.course.currentCourseId;

export const selectCurrentAssignmentDetail = (state: RootState) =>
  state.assignment.currentAssignment;
export const selectCurrentAssignmentStatus = (state: RootState) =>
  state.assignment.status;
export const selectCurrentAssignmentError = (state: RootState) =>
  state.assignment.error;
export const selectCurrentAssignmentId = (state: RootState) =>
  state.assignment.currentAssignmentId;

export const selectProgressEntries = (state: RootState) =>
  state.progress.entries;
export const selectProgressStatus = (state: RootState) => state.progress.status;
export const selectProgressError = (state: RootState) => state.progress.error;

export const selectDashboardCourses = createSelector(
  [selectDashboard],
  (dashboard) => dashboard?.courses ?? [],
);

export const selectDashboardRecentAssignments = createSelector(
  [selectDashboard],
  (dashboard) => dashboard?.recentAssignments ?? [],
);

export const selectFirstCourse = createSelector(
  [selectDashboardCourses],
  (courses) => courses[0] ?? null,
);

export const selectFirstAssignment = createSelector(
  [selectDashboardRecentAssignments],
  (assignments) => assignments[0] ?? null,
);

export const selectHeaderUser = createSelector([selectCurrentUser], (user) => ({
  fullName: user?.fullName ?? 'Пользователь',
  avatarFallback: user?.avatarFallback ?? 'MM',
}));

export const selectDashboardSummaryCards = createSelector(
  [selectDashboard],
  (dashboard) => {
    if (!dashboard) {
      return [];
    }

    return [
      {
        title: String(dashboard.progress.totalAssignments),
        description: 'Всего заданий',
      },
      {
        title: String(dashboard.progress.inProgressCount),
        description: 'В работе',
      },
      {
        title: String(dashboard.progress.submittedCount),
        description: 'Отправлено',
      },
      {
        title: String(dashboard.progress.gradedCount),
        description: 'Проверено',
      },
    ];
  },
);
