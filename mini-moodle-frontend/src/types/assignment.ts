import type { Course } from './course';

export type AssignmentStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'graded';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  courseId: string;
  courseTitle: string;
  status: AssignmentStatus;
}

export type SubmissionStatus = 'in_progress' | 'submitted' | 'graded';

export interface Submission {
  id: string;
  assignmentId: string;
  notes: string;
  status: SubmissionStatus;
  updatedAt: string;
}

export interface AssignmentDetail {
  assignment: Assignment;
  submission: Submission | null;
}

export interface ProgressEntry {
  course: Course;
  assignment: Assignment;
  submission: Submission;
}

export interface DashboardProgress {
  totalAssignments: number;
  submittedCount: number;
  gradedCount: number;
  inProgressCount: number;
}

export interface DashboardData {
  profile: import('./user').UserProfile;
  courses: Course[];
  recentAssignments: Assignment[];
  progress: DashboardProgress;
}

export interface CreateSubmissionRequest {
  notes: string;
  status?: SubmissionStatus;
}

export interface UpdateSubmissionRequest {
  notes: string;
  status: SubmissionStatus;
}
