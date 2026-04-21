import { useEffect } from 'react';
import { AssignmentList } from '../components/assignment/AssignmentList';
import { CourseList } from '../components/course/CourseList';
import { PageContainer } from '../components/layout/PageContainer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectDashboard,
  selectDashboardError,
  selectDashboardStatus,
  selectDashboardSummaryCards,
} from '../store/selectors';
import { fetchDashboardData } from '../store/thunks';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(selectDashboard);
  const status = useAppSelector(selectDashboardStatus);
  const error = useAppSelector(selectDashboardError);
  const summaryCards = useAppSelector(selectDashboardSummaryCards);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchDashboardData());
    }
  }, [dispatch, status]);

  if (status === 'failed' && !dashboard) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error?.statusCode === 401 || error?.statusCode === 403
            ? 'Для просмотра кабинета требуется активная авторизация.'
            : 'Не удалось загрузить данные кабинета.'}
        </div>
      </PageContainer>
    );
  }

  if (!dashboard) {
    return (
      <PageContainer>
        <div className="text-sm text-slate-500">Загружаем кабинет…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            Добро пожаловать, {dashboard.profile.fullName}
          </h2>
          <p className="text-sm text-slate-600">
            Отслеживайте курсы, задания и общий прогресс обучения.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.description}
              description={card.description}
              title={card.title}
            />
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Мои курсы</h3>
            <p className="text-sm text-slate-600">
              Курсы, доступные в вашем кабинете.
            </p>
          </div>
          <CourseList courses={dashboard.courses} />
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Ближайшие задания
            </h3>
            <p className="text-sm text-slate-600">
              Последние задания и их текущий статус.
            </p>
          </div>
          <AssignmentList assignments={dashboard.recentAssignments} />
        </section>
      </section>
    </PageContainer>
  );
}

interface SummaryCardProps {
  title: string;
  description: string;
}

function SummaryCard({ title, description }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-3xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-500">
        Актуальные данные загружены с сервера.
      </CardContent>
    </Card>
  );
}
