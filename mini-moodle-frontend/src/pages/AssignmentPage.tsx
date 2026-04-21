import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import {
  assignmentStatusMap,
  submissionStatusOptions,
} from '../lib/assignmentStatus';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectCurrentAssignmentDetail,
  selectCurrentAssignmentError,
  selectCurrentAssignmentId,
  selectCurrentAssignmentStatus,
} from '../store/selectors';
import {
  createSubmissionAndRefresh,
  deleteSubmissionAndRefresh,
  updateSubmissionAndRefresh,
} from '../store/learningFlows';
import { fetchAssignmentDetailData } from '../store/thunks';
import type { SubmissionStatus } from '../types/assignment';

interface AssignmentDraft {
  assignmentId: string;
  notes: string;
  submissionStatus: SubmissionStatus;
}

export function AssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const dispatch = useAppDispatch();
  const assignmentDetail = useAppSelector(selectCurrentAssignmentDetail);
  const status = useAppSelector(selectCurrentAssignmentStatus);
  const error = useAppSelector(selectCurrentAssignmentError);
  const currentAssignmentId = useAppSelector(selectCurrentAssignmentId);
  const isMutating = useAppSelector(
    (state) => state.settings.pendingRequests > 0,
  );

  const [draft, setDraft] = useState<AssignmentDraft | null>(null);

  useEffect(() => {
    if (assignmentId) {
      void dispatch(fetchAssignmentDetailData(assignmentId));
    }
  }, [assignmentId, dispatch]);

  const formState = useMemo(() => {
    if (draft && draft.assignmentId === assignmentId) {
      return {
        notes: draft.notes,
        submissionStatus: draft.submissionStatus,
      };
    }

    return {
      notes: assignmentDetail?.submission?.notes ?? '',
      submissionStatus:
        assignmentDetail?.submission?.status ??
        ('in_progress' as SubmissionStatus),
    };
  }, [assignmentDetail, assignmentId, draft]);

  const handleSave = async () => {
    if (!assignmentId || !assignmentDetail) {
      return;
    }

    try {
      if (assignmentDetail?.submission) {
        await dispatch(
          updateSubmissionAndRefresh({
            assignmentId,
            courseId: assignmentDetail.assignment.courseId,
            submissionId: assignmentDetail.submission.id,
            data: {
              notes: formState.notes,
              status: formState.submissionStatus,
            },
          }),
        );
      } else {
        await dispatch(
          createSubmissionAndRefresh({
            assignmentId,
            courseId: assignmentDetail.assignment.courseId,
            data: {
              notes: formState.notes,
              status: formState.submissionStatus,
            },
          }),
        );
      }

      setDraft(null);
    } catch {
      // Global error UI is rendered by CommonWrapper.
    }
  };

  const handleDelete = async () => {
    if (!assignmentDetail?.submission) {
      return;
    }

    const { assignment, submission } = assignmentDetail;

    try {
      await dispatch(
        deleteSubmissionAndRefresh({
          assignmentId: assignment.id,
          courseId: assignment.courseId,
          submissionId: submission.id,
        }),
      );
      setDraft(null);
    } catch {
      // Global error UI is rendered by CommonWrapper.
    }
  };

  if (status === 'failed' && currentAssignmentId === assignmentId) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            {error?.statusCode === 404
              ? 'Задание не найдено'
              : 'Задание недоступно'}
          </h2>
          <p className="text-sm text-slate-600">
            {error?.msg ?? 'Не удалось загрузить задание.'}
          </p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Назад в кабинет</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!assignmentDetail || assignmentDetail.assignment.id !== assignmentId) {
    return (
      <PageContainer>
        <div className="text-sm text-slate-500">Загружаем задание…</div>
      </PageContainer>
    );
  }

  const assignment = assignmentDetail.assignment;
  const badge = assignmentStatusMap[assignment.status];

  return (
    <PageContainer>
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{assignment.title}</CardTitle>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <CardDescription>{assignment.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <span className="font-medium">Курс:</span>{' '}
              {assignment.courseTitle}
            </p>
            <p>
              <span className="font-medium">Срок:</span> {assignment.deadline}
            </p>
            <p>
              <span className="font-medium">Последняя активность:</span>{' '}
              {assignmentDetail.submission?.updatedAt ?? 'Сдача ещё не создана'}
            </p>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="submission-status"
            >
              Статус сдачи
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-600"
              id="submission-status"
              onChange={(event) =>
                setDraft({
                  assignmentId: assignmentId ?? assignment.id,
                  notes: formState.notes,
                  submissionStatus: event.target.value as SubmissionStatus,
                })
              }
              value={formState.submissionStatus}
            >
              {submissionStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="submission-notes"
            >
              Комментарий к сдаче
            </label>
            <Textarea
              id="submission-notes"
              onChange={(event) =>
                setDraft({
                  assignmentId: assignmentId ?? assignment.id,
                  notes: event.target.value,
                  submissionStatus: formState.submissionStatus,
                })
              }
              placeholder="Напишите краткий комментарий к работе..."
              value={formState.notes}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button disabled={isMutating} onClick={handleSave}>
              {assignmentDetail.submission ? 'Обновить сдачу' : 'Создать сдачу'}
            </Button>
            <Button
              disabled={isMutating || !assignmentDetail.submission}
              onClick={handleDelete}
              variant="secondary"
            >
              Очистить сдачу
            </Button>
            <Button asChild variant="outline">
              <Link to={`/courses/${assignment.courseId}`}>Назад к курсу</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
