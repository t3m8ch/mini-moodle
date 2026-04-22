import { beforeEach, describe, expect, mock, test } from 'bun:test';

const callLog: string[] = [];

const dashboardPayload = {
  profile: {
    id: 'user-1',
    email: 'student@example.com',
    firstName: 'Ivan',
    lastName: 'Petrov',
    patronymic: 'Ivanovich',
    fullName: 'Ivan Petrov',
    avatarFallback: 'IP',
  },
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
      status: 'submitted' as const,
    },
  ],
  progress: {
    totalAssignments: 1,
    inProgressCount: 0,
    submittedCount: 1,
    gradedCount: 0,
  },
};

const assignmentDetailPayload = {
  assignment: dashboardPayload.recentAssignments[0],
  submission: {
    id: 'submission-1',
    assignmentId: 'assignment-1',
    notes: 'Ready for review',
    status: 'submitted' as const,
    updatedAt: '2026-04-21T10:00:00Z',
  },
};

const courseDetailPayload = {
  course: dashboardPayload.courses[0],
  assignments: dashboardPayload.recentAssignments,
};

const progressPayload = [
  {
    course: courseDetailPayload.course,
    assignment: assignmentDetailPayload.assignment,
    submission: assignmentDetailPayload.submission,
  },
];

mock.module('../src/api/auth', () => ({
  fetchCurrentUser: async () => {
    throw new Error('not used in this test');
  },
  login: async () => {
    throw new Error('not used in this test');
  },
  register: async () => {
    throw new Error('not used in this test');
  },
  logout: async () => null,
}));

mock.module('../src/api/learning', () => ({
  fetchDashboard: async () => {
    callLog.push('fetchDashboard');
    return dashboardPayload;
  },
  fetchCourseDetail: async () => {
    callLog.push('fetchCourseDetail');
    return courseDetailPayload;
  },
  fetchAssignmentDetail: async () => {
    callLog.push('fetchAssignmentDetail');
    return assignmentDetailPayload;
  },
  fetchProfile: async () => {
    callLog.push('fetchProfile');
    return dashboardPayload.profile;
  },
  updateProfile: async () => {
    callLog.push('updateProfile');
    return {
      ...dashboardPayload.profile,
      fullName: 'Ivan Petrov Updated',
      avatarFallback: 'IU',
    };
  },
  fetchProgress: async () => {
    callLog.push('fetchProgress');
    return progressPayload;
  },
  createSubmission: async () => {
    callLog.push('createSubmission');
    return assignmentDetailPayload;
  },
  updateSubmission: async () => {
    callLog.push('updateSubmission');
    return assignmentDetailPayload;
  },
  deleteSubmission: async () => {
    callLog.push('deleteSubmission');
    return null;
  },
}));

function createHarness() {
  const dispatchedActionTypes: string[] = [];

  const getState = () => ({
    user: {
      currentUser: null,
      sessionStatus: 'guest',
      authActionStatus: 'idle',
    },
    settings: { pendingRequests: 0, error: null },
    dashboard: { data: null, status: 'idle', error: null },
    course: {
      currentCourse: null,
      currentCourseId: null,
      status: 'idle',
      error: null,
    },
    assignment: {
      currentAssignment: assignmentDetailPayload,
      currentAssignmentId: assignmentDetailPayload.assignment.id,
      status: 'succeeded',
      error: null,
    },
    progress: { entries: [], status: 'idle', error: null },
    profile: { profile: null, status: 'idle', error: null },
  });

  const dispatch = (action: unknown) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, undefined);
    }

    dispatchedActionTypes.push((action as { type: string }).type);
    return action;
  };

  return { dispatch, dispatchedActionTypes, getState };
}

describe('learning refetch flows', () => {
  beforeEach(() => {
    callLog.length = 0;
  });

  test('submission flows refetch affected learning views after a successful mutation', async () => {
    const { createSubmissionAndRefresh } =
      await import('../src/store/learningFlows');
    const harness = createHarness();

    await createSubmissionAndRefresh({
      assignmentId: 'assignment-1',
      courseId: 'course-1',
      data: {
        notes: 'Ready for review',
        status: 'submitted',
      },
    })(harness.dispatch as never, harness.getState as never, undefined);

    expect(callLog).toEqual([
      'createSubmission',
      'fetchAssignmentDetail',
      'fetchCourseDetail',
      'fetchDashboard',
      'fetchProgress',
    ]);
    expect(harness.dispatchedActionTypes).toEqual(
      expect.arrayContaining([
        'assignments/createSubmission/pending',
        'assignments/createSubmission/fulfilled',
        'assignment/fetchAssignmentDetail/pending',
        'assignment/fetchAssignmentDetail/fulfilled',
        'course/fetchCourseDetail/pending',
        'course/fetchCourseDetail/fulfilled',
        'dashboard/fetchDashboard/pending',
        'dashboard/fetchDashboard/fulfilled',
        'progress/fetchProgress/pending',
        'progress/fetchProgress/fulfilled',
      ]),
    );
  });

  test('profile save flow refreshes profile and dashboard data after a successful update', async () => {
    const { saveProfileAndRefresh } =
      await import('../src/store/learningFlows');
    const harness = createHarness();

    await saveProfileAndRefresh({
      email: 'student@example.com',
      firstName: 'Ivan',
      lastName: 'Petrov',
      patronymic: 'Ivanovich',
    })(harness.dispatch as never, harness.getState as never, undefined);

    expect(callLog).toEqual([
      'updateProfile',
      'fetchProfile',
      'fetchDashboard',
    ]);
    expect(harness.dispatchedActionTypes).toEqual(
      expect.arrayContaining([
        'profile/saveProfile/pending',
        'profile/saveProfile/fulfilled',
        'profile/fetchProfile/pending',
        'profile/fetchProfile/fulfilled',
        'dashboard/fetchDashboard/pending',
        'dashboard/fetchDashboard/fulfilled',
      ]),
    );
  });
});
