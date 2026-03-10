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
  status: AssignmentStatus;
}
