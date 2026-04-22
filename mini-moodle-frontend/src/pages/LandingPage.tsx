import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAppSelector } from '../store/hooks';

export function LandingPage() {
  const sessionStatus = useAppSelector((state) => state.user.sessionStatus);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const isAuthenticated = sessionStatus === 'authenticated';
  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-white to-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          mini-Moodle
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Учебное пространство с курсами, заданиями, прогрессом и защищённым
          кабинетом пользователя.
        </p>

        <div className="mt-6 rounded-2xl border border-sky-100 bg-white/80 px-5 py-4 text-left shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-slate-900">
            Демо-аккаунт для проверки
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Email: <span className="font-medium">student@example.com</span>
          </p>
          <p className="text-sm text-slate-600">
            Пароль: <span className="font-medium">password123</span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isAuthenticated ? (
            <>
              <Button asChild>
                <Link to="/dashboard">Перейти в кабинет</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/profile">
                  {currentUser?.fullName ?? 'Открыть профиль'}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/login">Войти</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/register">Регистрация</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
