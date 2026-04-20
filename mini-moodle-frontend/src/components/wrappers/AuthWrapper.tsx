import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCurrentUser } from '../../store/thunks';

export function AuthWrapper() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const status = useAppSelector((state) => state.user.status);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />
          Проверяем авторизацию…
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
