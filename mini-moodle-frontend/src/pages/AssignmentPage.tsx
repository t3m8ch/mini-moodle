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
import { assignments } from '../mock/assignments';
import { courses } from '../mock/courses';
import type { AssignmentStatus } from '../types/assignment';

const statusMap: Record<
  AssignmentStatus,
  { label: string; variant: 'secondary' | 'warning' | 'default' | 'success' }
> = {
  not_started: { label: 'Не начато', variant: 'secondary' },
  in_progress: { label: 'В процессе', variant: 'warning' },
  submitted: { label: 'Отправлено', variant: 'default' },
  graded: { label: 'Проверено', variant: 'success' },
};

export function AssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Задание не найдено
          </h2>
          <Button asChild variant="outline">
            <Link to="/dashboard">Назад в кабинет</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const course = courses.find((item) => item.id === assignment.courseId);
  const status = statusMap[assignment.status];

  return (
    <PageContainer>
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{assignment.title}</CardTitle>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <CardDescription>{assignment.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <span className="font-medium">Курс:</span>{' '}
              {course?.title ?? 'Неизвестный курс'}
            </p>
            <p>
              <span className="font-medium">Срок:</span>{' '}
              {assignment.deadline}
            </p>
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
              placeholder="Напишите краткий комментарий к работе..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button>Отправить задание</Button>
            <Button asChild variant="outline">
              <Link to={`/courses/${assignment.courseId}`}>Назад к курсу</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
