import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/thunks';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const authActionStatus = useAppSelector(
    (state) => state.user.authActionStatus,
  );

  const [formState, setFormState] = useState({
    email: 'student@example.com',
    password: 'password123',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(loginUser(formState)).unwrap();
    } catch {
      // Global error UI is rendered by CommonWrapper.
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход</CardTitle>
          <CardDescription>
            Войдите, чтобы получить доступ к курсам, профилю и заданиям.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="email"
              >
                Электронная почта
              </label>
              <Input
                id="email"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="student@example.com"
                required
                type="email"
                value={formState.email}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Пароль
              </label>
              <Input
                id="password"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
                type="password"
                value={formState.password}
              />
            </div>
            <Button
              className="w-full"
              disabled={authActionStatus === 'loading'}
              type="submit"
            >
              {authActionStatus === 'loading' ? 'Входим…' : 'Войти'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Нет аккаунта?{' '}
            <Link
              className="font-medium text-sky-700 hover:underline"
              to="/register"
            >
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
