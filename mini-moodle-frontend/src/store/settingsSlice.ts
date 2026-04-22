import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  type UnknownAction,
} from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import {
  createAssignmentSubmission,
  deleteAssignmentSubmission,
  fetchAssignmentDetailData,
  fetchCurrentUser,
  fetchCourseDetailData,
  fetchDashboardData,
  fetchProfileData,
  fetchProgressData,
  loginUser,
  logoutUser,
  registerUser,
  saveProfileData,
  updateAssignmentSubmission,
} from './thunks';
import { sessionExpired } from './userSlice';

const trackedThunks = [
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  fetchDashboardData,
  fetchCourseDetailData,
  fetchAssignmentDetailData,
  fetchProfileData,
  saveProfileData,
  fetchProgressData,
  createAssignmentSubmission,
  updateAssignmentSubmission,
  deleteAssignmentSubmission,
] as const;

interface SettingsState {
  pendingRequests: number;
  error: ApiErrorResponse | null;
}

const initialState: SettingsState = {
  pendingRequests: 0,
  error: null,
};

function decrementPending(state: SettingsState) {
  state.pendingRequests = Math.max(0, state.pendingRequests - 1);
}

function isSilentBootstrapError(action: UnknownAction) {
  return (
    action.type === fetchCurrentUser.rejected.type &&
    (action as { payload?: ApiErrorResponse }).payload?.statusCode === 401
  );
}

function isInterceptorHandledError(action: UnknownAction) {
  return Boolean(
    (action as { payload?: ApiErrorResponse }).payload?.handledByInterceptor,
  );
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.pendingRequests = 0;
      })
      .addCase(sessionExpired, () => initialState);

    builder
      .addMatcher(isPending(...trackedThunks), (state) => {
        state.pendingRequests += 1;
      })
      .addMatcher(isFulfilled(...trackedThunks), (state) => {
        decrementPending(state);
      })
      .addMatcher(isRejected(...trackedThunks), (state, action) => {
        decrementPending(state);

        if (
          isSilentBootstrapError(action) ||
          isInterceptorHandledError(action)
        ) {
          return;
        }

        state.error = (action as { payload?: ApiErrorResponse }).payload ?? {
          status: 'ERROR',
          msg: 'Произошла ошибка при обработке запроса',
          statusCode: 500,
        };
      });
  },
});

export const { clearError } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
