import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">
          Страница не найдена
        </h1>
        <Button asChild>
          <Link to="/">На главную</Link>
        </Button>
      </div>
    </div>
  );
}
