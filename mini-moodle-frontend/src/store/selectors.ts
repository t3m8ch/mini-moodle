import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectDashboard = (state: RootState) => state.courses.dashboard;
export const selectDashboardStatus = (state: RootState) =>
  state.courses.dashboardStatus;
export const selectDashboardError = (state: RootState) =>
  state.courses.dashboardError;

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
