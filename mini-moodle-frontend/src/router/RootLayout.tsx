import { Outlet, useNavigation } from 'react-router-dom';

export function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';
  const loadingLabel =
    navigation.state === 'submitting'
      ? 'Отправляем данные…'
      : 'Загружаем страницу…';

  return (
    <>
      {isNavigating ? (
        <>
          <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
            <div className="h-1 animate-pulse bg-sky-500 shadow-[0_0_16px_rgba(14,165,233,0.55)]" />
          </div>

          <div
            aria-live="polite"
            aria-atomic="true"
            className="pointer-events-none fixed right-4 top-4 z-50"
            role="status"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
              <span>{loadingLabel}</span>
            </div>
          </div>
        </>
      ) : null}

      <Outlet />
    </>
  );
}
