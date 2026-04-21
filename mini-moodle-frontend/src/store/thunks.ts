import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/auth';
import * as learningApi from '../api/learning';
import { toApiError, type ApiErrorResponse } from '../api/client';
import type {
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
} from '../types/assignment';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '../types/user';
import type { RootState } from './index';

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: ApiErrorResponse;
}>();

export const fetchCurrentUser = createAppAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.fetchCurrentUser();
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (_, { getState }) => getState().user.status === 'idle',
  },
);

export const loginUser = createAppAsyncThunk(
  'user/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const registerUser = createAppAsyncThunk(
  'user/register',
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      return await authApi.register(payload);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const logoutUser = createAppAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchDashboardData = createAppAsyncThunk(
  'courses/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await learningApi.fetchDashboard();
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().courses.dashboardStatus === 'idle',
  },
);

export const fetchCourseDetailData = createAppAsyncThunk(
  'courses/fetchCourseDetail',
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await learningApi.fetchCourseDetail(courseId);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (courseId, { getState }) => {
      const { currentCourseId, currentCourseStatus } = getState().courses;

      if (currentCourseStatus === 'loading' && currentCourseId === courseId) {
        return false;
      }

      if (currentCourseStatus === 'succeeded' && currentCourseId === courseId) {
        return false;
      }

      return true;
    },
  },
);

export const fetchAssignmentDetailData = createAppAsyncThunk(
  'assignments/fetchAssignmentDetail',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      return await learningApi.fetchAssignmentDetail(assignmentId);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (assignmentId, { getState }) => {
      const { currentAssignmentId, currentAssignmentStatus } =
        getState().assignments;

      if (
        currentAssignmentStatus === 'loading' &&
        currentAssignmentId === assignmentId
      ) {
        return false;
      }

      if (
        currentAssignmentStatus === 'succeeded' &&
        currentAssignmentId === assignmentId
      ) {
        return false;
      }

      return true;
    },
  },
);

export const fetchProfileData = createAppAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await learningApi.fetchProfile();
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (_, { getState }) => getState().profile.status === 'idle',
  },
);

export const saveProfileData = createAppAsyncThunk(
  'profile/saveProfile',
  async (payload: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      return await learningApi.updateProfile(payload);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const fetchProgressData = createAppAsyncThunk(
  'assignments/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      return await learningApi.fetchProgress();
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().assignments.progressStatus === 'idle',
  },
);

export const createAssignmentSubmission = createAppAsyncThunk(
  'assignments/createSubmission',
  async (
    payload: { assignmentId: string; data: CreateSubmissionRequest },
    { rejectWithValue },
  ) => {
    try {
      return await learningApi.createSubmission(
        payload.assignmentId,
        payload.data,
      );
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const updateAssignmentSubmission = createAppAsyncThunk(
  'assignments/updateSubmission',
  async (
    payload: { submissionId: string; data: UpdateSubmissionRequest },
    { rejectWithValue },
  ) => {
    try {
      return await learningApi.updateSubmission(
        payload.submissionId,
        payload.data,
      );
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const deleteAssignmentSubmission = createAppAsyncThunk(
  'assignments/deleteSubmission',
  async (submissionId: string, { getState, rejectWithValue }) => {
    const currentAssignment = getState().assignments.currentAssignment;

    try {
      await learningApi.deleteSubmission(submissionId);
      return {
        submissionId,
        assignmentId: currentAssignment?.assignment.id ?? null,
        courseId: currentAssignment?.assignment.courseId ?? null,
      };
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
