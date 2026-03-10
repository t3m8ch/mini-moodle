import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-white to-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          mini-Moodle
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Легкое учебное пространство для просмотра курсов, проверки заданий и
          отслеживания прогресса в обучении.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/login">Войти</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/register">Регистрация</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Открыть демо-кабинет</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
