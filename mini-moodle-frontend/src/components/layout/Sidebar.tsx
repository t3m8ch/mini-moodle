import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  UserRound,
} from 'lucide-react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAppSelector } from '../../store/hooks';

export function Sidebar() {
  const { pathname } = useLocation();
  const firstCourse = useAppSelector(
    (state) => state.courses.dashboard?.courses[0] ?? null,
  );
  const firstAssignment = useAppSelector(
    (state) => state.courses.dashboard?.recentAssignments[0] ?? null,
  );

  const navItems = [
    {
      to: '/dashboard',
      label: 'Кабинет',
      icon: LayoutDashboard,
      isActive: (value: string) => value === '/dashboard',
    },
    {
      to: '/profile',
      label: 'Профиль',
      icon: UserRound,
      isActive: (value: string) => value === '/profile',
    },
    {
      to: firstCourse ? `/courses/${firstCourse.id}` : '/dashboard',
      label: 'Мои курсы',
      icon: BookOpen,
      isActive: (value: string) =>
        Boolean(matchPath('/courses/:courseId', value)),
    },
    {
      to: firstAssignment ? `/assignments/${firstAssignment.id}` : '/progress',
      label: 'Задания',
      icon: ClipboardList,
      isActive: (value: string) =>
        Boolean(matchPath('/assignments/:assignmentId', value)) ||
        value === '/progress',
    },
  ];

  return (
    <aside className="border-b border-slate-200 bg-white md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex flex-row items-center gap-2 overflow-x-auto px-4 py-3 md:flex-col md:items-stretch md:py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={() =>
              cn(
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.isActive(pathname)
                  ? 'bg-sky-100 text-sky-800'
                  : 'text-slate-700 hover:bg-slate-100',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
