import { useEffect, type ReactNode } from 'react';
import { matchPath, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCurrentUser } from '../../store/thunks';

const PUBLIC_PATHS = ['/'] as const;
const GUEST_ONLY_PATHS = ['/login', '/register'] as const;
const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/courses/:courseId',
  '/assignments/:assignmentId',
  '/progress',
] as const;

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const sessionStatus = useAppSelector((state) => state.user.sessionStatus);

  const isPublicPath = PUBLIC_PATHS.includes(
    location.pathname as (typeof PUBLIC_PATHS)[number],
  );
  const isGuestOnlyPath = GUEST_ONLY_PATHS.includes(
    location.pathname as (typeof GUEST_ONLY_PATHS)[number],
  );
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  useEffect(() => {
    if (sessionStatus === 'unknown') {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, sessionStatus]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (sessionStatus === 'unknown' || sessionStatus === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />
          Проверяем авторизацию…
        </div>
      </div>
    );
  }

  if (isGuestOnlyPath && sessionStatus === 'authenticated') {
    return <Navigate replace to="/dashboard" />;
  }

  if (isProtectedPath && sessionStatus !== 'authenticated') {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <>{children}</>;
}
