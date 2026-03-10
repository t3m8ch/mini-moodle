import { CourseList } from '../components/course/CourseList';
import { PageContainer } from '../components/layout/PageContainer';
import { courses } from '../mock/courses';

export function DashboardPage() {
  return (
    <PageContainer>
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Кабинет</h2>
          <p className="text-sm text-slate-600">Ваши курсы.</p>
        </div>

        <CourseList courses={courses} />
      </section>
    </PageContainer>
  );
}
