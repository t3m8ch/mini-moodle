import { describe, expect, test } from 'bun:test';
import { assignmentReducer } from '../src/store/assignmentSlice';
import { courseReducer } from '../src/store/courseSlice';
import { dashboardReducer } from '../src/store/dashboardSlice';
import { profileReducer } from '../src/store/profileSlice';
import { progressReducer } from '../src/store/progressSlice';
import type { RootState } from '../src/store';
import {
  selectCurrentAssignmentDetail,
  selectCurrentCourseDetail,
  selectDashboard,
  selectDashboardSummaryCards,
  selectFirstAssignment,
  selectFirstCourse,
  selectProgressEntries,
} from '../src/store/selectors';
import {
  fetchAssignmentDetailData,
  fetchCourseDetailData,
  fetchDashboardData,
  fetchProfileData,
  fetchProgressData,
} from '../src/store/thunks';
import type {
  AssignmentDetail,
  DashboardData,
  ProgressEntry,
} from '../src/types/assignment';
import type { CourseDetail } from '../src/types/course';
import type { UserProfile } from '../src/types/user';

const profile: UserProfile = {
  id: 'user-1',
  email: 'student@example.com',
  firstName: 'Ivan',
  lastName: 'Petrov',
  patronymic: 'Ivanovich',
  fullName: 'Ivan Petrov',
  avatarFallback: 'IP',
};

const dashboardPayload: DashboardData = {
  profile,
  courses: [
    {
      id: 'course-1',
      title: 'Frontend Architecture',
      description: 'Normalized state management patterns',
      teacherName: 'Ada Lovelace',
      studentsCount: 24,
    },
  ],
  recentAssignments: [
    {
      id: 'assignment-1',
      title: 'Simplify state',
      description: 'Move to response-shaped slices',
      deadline: '2026-04-22T10:00:00Z',
      courseId: 'course-1',
      courseTitle: 'Frontend Architecture',
      status: 'in_progress',
    },
  ],
  progress: {
    totalAssignments: 1,
    inProgressCount: 1,
    submittedCount: 0,
    gradedCount: 0,
  },
};

const courseDetailPayload: CourseDetail = {
  course: dashboardPayload.courses[0],
  assignments: dashboardPayload.recentAssignments,
};

const assignmentDetailPayload: AssignmentDetail = {
  assignment: dashboardPayload.recentAssignments[0],
  submission: {
    id: 'submission-1',
    assignmentId: 'assignment-1',
    notes: 'In progress',
    status: 'in_progress',
    updatedAt: '2026-04-21T10:00:00Z',
  },
};

const progressPayload: ProgressEntry[] = [
  {
    course: courseDetailPayload.course,
    assignment: assignmentDetailPayload.assignment,
    submission: assignmentDetailPayload.submission!,
  },
];

function createRootState(): RootState {
  return {
    user: {
      currentUser: null,
      sessionStatus: 'guest',
      authActionStatus: 'idle',
    },
    settings: {
      pendingRequests: 0,
      error: null,
    },
    dashboard: dashboardReducer(
      undefined,
      fetchDashboardData.fulfilled(dashboardPayload, 'dashboard', undefined),
    ),
    course: courseReducer(
      undefined,
      fetchCourseDetailData.fulfilled(
        courseDetailPayload,
        'course',
        'course-1',
      ),
    ),
    assignment: assignmentReducer(
      undefined,
      fetchAssignmentDetailData.fulfilled(
        assignmentDetailPayload,
        'assignment',
        'assignment-1',
      ),
    ),
    progress: progressReducer(
      undefined,
      fetchProgressData.fulfilled(progressPayload, 'progress', undefined),
    ),
    profile: profileReducer(
      undefined,
      fetchProfileData.fulfilled(profile, 'profile', undefined),
    ),
  } as RootState;
}

describe('feature/query learning state', () => {
  test('selectors read response-shaped dashboard, course, assignment, and progress data', () => {
    const state = createRootState();

    expect(selectDashboard(state)).toEqual(dashboardPayload);
    expect(selectCurrentCourseDetail(state)).toEqual(courseDetailPayload);
    expect(selectCurrentAssignmentDetail(state)).toEqual(
      assignmentDetailPayload,
    );
    expect(selectProgressEntries(state)).toEqual(progressPayload);
    expect(selectFirstCourse(state)?.id).toBe('course-1');
    expect(selectFirstAssignment(state)?.id).toBe('assignment-1');
  });

  test('dashboard summary cards are derived from the dashboard response', () => {
    const state = createRootState();

    expect(selectDashboardSummaryCards(state)).toEqual([
      {
        title: '1',
        description: 'Всего заданий',
      },
      {
        title: '1',
        description: 'В работе',
      },
      {
        title: '0',
        description: 'Отправлено',
      },
      {
        title: '0',
        description: 'Проверено',
      },
    ]);
  });
});
