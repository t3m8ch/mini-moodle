import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AssignmentList } from '../components/assignment/AssignmentList';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCourseDetailData } from '../store/thunks';

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useAppDispatch();
  const courseDetail = useAppSelector((state) => state.courses.currentCourse);
  const status = useAppSelector((state) => state.courses.currentCourseStatus);
  const error = useAppSelector((state) => state.courses.currentCourseError);
  const currentCourseId = useAppSelector(
    (state) => state.courses.currentCourseId,
  );

  useEffect(() => {
    if (courseId) {
      void dispatch(fetchCourseDetailData(courseId));
    }
  }, [courseId, dispatch]);

  if (status === 'failed' && currentCourseId === courseId) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            {error?.statusCode === 404 ? 'Курс не найден' : 'Курс недоступен'}
          </h2>
          <p className="text-sm text-slate-600">
            {error?.msg ?? 'Не удалось загрузить данные курса.'}
          </p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Назад в кабинет</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!courseDetail || courseDetail.course.id !== courseId) {
    return (
      <PageContainer>
        <div className="text-sm text-slate-500">Загружаем курс…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            {courseDetail.course.title}
          </h2>
          <p className="text-slate-600">{courseDetail.course.description}</p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Преподаватель:</span>{' '}
            {courseDetail.course.teacherName}
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Задания</h3>
          <AssignmentList assignments={courseDetail.assignments} />
        </section>
      </section>
    </PageContainer>
  );
}
