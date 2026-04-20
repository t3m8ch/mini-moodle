import type { AssignmentStatus, SubmissionStatus } from '../types/assignment';

export const assignmentStatusMap: Record<
  AssignmentStatus,
  { label: string; variant: 'secondary' | 'warning' | 'default' | 'success' }
> = {
  not_started: { label: 'Не начато', variant: 'secondary' },
  in_progress: { label: 'В процессе', variant: 'warning' },
  submitted: { label: 'Отправлено', variant: 'default' },
  graded: { label: 'Проверено', variant: 'success' },
};

export const submissionStatusOptions: Array<{
  value: SubmissionStatus;
  label: string;
}> = [
  { value: 'in_progress', label: 'Черновик' },
  { value: 'submitted', label: 'Отправлено преподавателю' },
  { value: 'graded', label: 'Проверено' },
];
