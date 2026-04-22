import { AlertTriangle, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError } from '../../store/settingsSlice';

interface CommonWrapperProps {
  children: ReactNode;
}

export function CommonWrapper({ children }: CommonWrapperProps) {
  const dispatch = useAppDispatch();
  const pendingRequests = useAppSelector(
    (state) => state.settings.pendingRequests,
  );
  const error = useAppSelector((state) => state.settings.error);

  return (
    <>
      {pendingRequests > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
          <div className="h-1 animate-pulse bg-sky-500 shadow-[0_0_16px_rgba(14,165,233,0.55)]" />
        </div>
      ) : null}

      {children}

      {error ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-2 text-rose-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Ошибка запроса
                  </h2>
                  <p className="text-sm text-slate-600">{error.msg}</p>
                  <p className="text-xs text-slate-400">
                    HTTP статус: {error.statusCode}
                  </p>
                </div>
              </div>

              <button
                aria-label="Закрыть сообщение об ошибке"
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                onClick={() => dispatch(clearError())}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                onClick={() => dispatch(clearError())}
                variant="secondary"
              >
                Понятно
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
