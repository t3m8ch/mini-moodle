import { BookOpen, ClipboardList, LayoutDashboard } from 'lucide-react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { assignments } from '../../mock/assignments';
import { courses } from '../../mock/courses';
import { cn } from '../../lib/utils';

const firstAssignment = assignments[0];
const firstCourse = courses[0];

const navItems = [
  {
    to: '/dashboard',
    label: 'Кабинет',
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === '/dashboard',
  },
  {
    to: firstCourse ? `/courses/${firstCourse.id}` : '/dashboard',
    label: 'Мои курсы',
    icon: BookOpen,
    isActive: (pathname: string) =>
      Boolean(matchPath('/courses/:courseId', pathname)),
  },
  {
    to: firstAssignment ? `/assignments/${firstAssignment.id}` : '/dashboard',
    label: 'Задания',
    icon: ClipboardList,
    isActive: (pathname: string) =>
      Boolean(matchPath('/assignments/:assignmentId', pathname)),
  },
];

export function Sidebar() {
  const { pathname } = useLocation();

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
