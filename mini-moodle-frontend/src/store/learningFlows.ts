import type {
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
} from '../types/assignment';
import type { UpdateProfileRequest } from '../types/user';
import type { AppDispatch, AppThunk } from './index';
import {
  createAssignmentSubmission,
  deleteAssignmentSubmission,
  fetchAssignmentDetailData,
  fetchCourseDetailData,
  fetchDashboardData,
  fetchProfileData,
  fetchProgressData,
  saveProfileData,
  updateAssignmentSubmission,
} from './thunks';

async function refreshAssignmentDependencies(
  dispatch: AppDispatch,
  assignmentId: string,
  courseId: string,
) {
  await Promise.all([
    dispatch(fetchAssignmentDetailData(assignmentId)).unwrap(),
    dispatch(fetchCourseDetailData(courseId)).unwrap(),
    dispatch(fetchDashboardData()).unwrap(),
    dispatch(fetchProgressData()).unwrap(),
  ]);
}

export function createSubmissionAndRefresh(payload: {
  assignmentId: string;
  courseId: string;
  data: CreateSubmissionRequest;
}): AppThunk<Promise<void>> {
  return async (dispatch) => {
    await dispatch(
      createAssignmentSubmission({
        assignmentId: payload.assignmentId,
        data: payload.data,
      }),
    ).unwrap();

    await refreshAssignmentDependencies(
      dispatch as AppDispatch,
      payload.assignmentId,
      payload.courseId,
    );
  };
}

export function updateSubmissionAndRefresh(payload: {
  assignmentId: string;
  courseId: string;
  submissionId: string;
  data: UpdateSubmissionRequest;
}): AppThunk<Promise<void>> {
  return async (dispatch) => {
    await dispatch(
      updateAssignmentSubmission({
        submissionId: payload.submissionId,
        data: payload.data,
      }),
    ).unwrap();

    await refreshAssignmentDependencies(
      dispatch as AppDispatch,
      payload.assignmentId,
      payload.courseId,
    );
  };
}

export function deleteSubmissionAndRefresh(payload: {
  assignmentId: string;
  courseId: string;
  submissionId: string;
}): AppThunk<Promise<void>> {
  return async (dispatch) => {
    await dispatch(deleteAssignmentSubmission(payload.submissionId)).unwrap();

    await refreshAssignmentDependencies(
      dispatch as AppDispatch,
      payload.assignmentId,
      payload.courseId,
    );
  };
}

export function saveProfileAndRefresh(
  payload: UpdateProfileRequest,
): AppThunk<Promise<void>> {
  return async (dispatch) => {
    await dispatch(saveProfileData(payload)).unwrap();

    await Promise.all([
      dispatch(fetchProfileData()).unwrap(),
      dispatch(fetchDashboardData()).unwrap(),
    ]);
  };
}
