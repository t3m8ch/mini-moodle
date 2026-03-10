import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AssignmentList } from '../components/assignment/AssignmentList';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/button';
import { courses } from '../mock/courses';
import { assignments } from '../mock/assignments';

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();

  const course = courses.find((item) => item.id === courseId);
  const courseAssignments = useMemo(
    () => assignments.filter((item) => item.courseId === courseId),
    [courseId],
  );

  if (!course) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Курс не найден
          </h2>
          <Button asChild variant="outline">
            <Link to="/dashboard">Назад в кабинет</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            {course.title}
          </h2>
          <p className="text-slate-600">{course.description}</p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Преподаватель:</span>{' '}
            {course.teacherName}
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Задания</h3>
          <AssignmentList assignments={courseAssignments} />
        </section>
      </section>
    </PageContainer>
  );
}
