import { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { assignmentStatusMap } from '../lib/assignmentStatus';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectProgressEntries,
  selectProgressStatus,
} from '../store/selectors';
import { fetchProgressData } from '../store/thunks';

export function ProgressPage() {
  const dispatch = useAppDispatch();
  const progress = useAppSelector(selectProgressEntries);
  const status = useAppSelector(selectProgressStatus);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProgressData());
    }
  }, [dispatch, status]);

  if (status === 'loading' && progress.length === 0) {
    return (
      <PageContainer>
        <div className="text-sm text-slate-500">Загружаем прогресс…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Прогресс</h2>
          <p className="text-sm text-slate-600">
            История сдач и статусов по всем заданиям.
          </p>
        </div>

        {progress.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Сдач пока нет</CardTitle>
              <CardDescription>
                Создайте первую сдачу на странице задания.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {progress.map((entry) => {
              const badge = assignmentStatusMap[entry.assignment.status];

              return (
                <Card key={entry.submission.id}>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle>{entry.assignment.title}</CardTitle>
                        <CardDescription>
                          {entry.assignment.description}
                        </CardDescription>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>
                      <span className="font-medium">Курс:</span>{' '}
                      {entry.course.title}
                    </p>
                    <p>
                      <span className="font-medium">Комментарий:</span>{' '}
                      {entry.submission.notes}
                    </p>
                    <p>
                      <span className="font-medium">Обновлено:</span>{' '}
                      {entry.submission.updatedAt}
                    </p>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/assignments/${entry.assignment.id}`}>
                        Открыть задание
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
