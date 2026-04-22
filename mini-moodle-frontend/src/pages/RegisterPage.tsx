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
import { registerUser } from '../store/thunks';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const authActionStatus = useAppSelector(
    (state) => state.user.authActionStatus,
  );

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(registerUser(formState)).unwrap();
    } catch {
      // Global error UI is rendered by CommonWrapper.
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт в mini-Moodle.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="firstName"
              >
                Имя
              </label>
              <Input
                id="firstName"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
                placeholder="Алекс"
                required
                value={formState.firstName}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="lastName"
              >
                Фамилия
              </label>
              <Input
                id="lastName"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
                placeholder="Картер"
                required
                value={formState.lastName}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="patronymic"
              >
                Отчество
              </label>
              <Input
                id="patronymic"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    patronymic: event.target.value,
                  }))
                }
                placeholder="Иванович"
                value={formState.patronymic}
              />
            </div>
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
              {authActionStatus === 'loading'
                ? 'Создаём аккаунт…'
                : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Уже зарегистрированы?{' '}
            <Link
              className="font-medium text-sky-700 hover:underline"
              to="/login"
            >
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
