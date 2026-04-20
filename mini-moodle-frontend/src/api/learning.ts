import { apiClient, unwrapNullablePayload, unwrapPayload } from './client';
import type {
  AssignmentDetail,
  CreateSubmissionRequest,
  DashboardData,
  ProgressEntry,
  UpdateSubmissionRequest,
} from '../types/assignment';
import type { Course, CourseDetail } from '../types/course';
import type { UpdateProfileRequest, UserProfile } from '../types/user';

export function fetchDashboard() {
  return unwrapPayload<DashboardData>(apiClient.get('/dashboard'));
}

export function fetchCourses() {
  return unwrapPayload<Course[]>(apiClient.get('/courses'));
}

export function fetchCourseDetail(courseId: string) {
  return unwrapPayload<CourseDetail>(apiClient.get(`/courses/${courseId}`));
}

export function fetchAssignmentDetail(assignmentId: string) {
  return unwrapPayload<AssignmentDetail>(
    apiClient.get(`/assignments/${assignmentId}`),
  );
}

export function fetchProfile() {
  return unwrapPayload<UserProfile>(apiClient.get('/profile'));
}

export function updateProfile(payload: UpdateProfileRequest) {
  return unwrapPayload<UserProfile>(apiClient.put('/profile', payload));
}

export function fetchProgress() {
  return unwrapPayload<ProgressEntry[]>(apiClient.get('/progress'));
}

export function createSubmission(
  assignmentId: string,
  payload: CreateSubmissionRequest,
) {
  return unwrapPayload<AssignmentDetail>(
    apiClient.post(`/assignments/${assignmentId}/submission`, payload),
  );
}

export function updateSubmission(
  submissionId: string,
  payload: UpdateSubmissionRequest,
) {
  return unwrapPayload<AssignmentDetail>(
    apiClient.patch(`/submissions/${submissionId}`, payload),
  );
}

export function deleteSubmission(submissionId: string) {
  return unwrapNullablePayload(
    apiClient.delete(`/submissions/${submissionId}`),
  );
}
