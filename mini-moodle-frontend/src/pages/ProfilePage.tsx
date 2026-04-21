import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
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
import { saveProfileAndRefresh } from '../store/learningFlows';
import { fetchProfileData } from '../store/thunks';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
}

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const status = useAppSelector((state) => state.profile.status);
  const [draft, setDraft] = useState<ProfileFormState | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProfileData());
    }
  }, [dispatch, status]);

  const formState = useMemo<ProfileFormState>(() => {
    if (draft) {
      return draft;
    }

    return {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      patronymic: profile?.patronymic ?? '',
      email: profile?.email ?? '',
    };
  }, [draft, profile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(saveProfileAndRefresh(formState));
      setDraft(null);
    } catch {
      // Global error UI is rendered by CommonWrapper.
    }
  };

  if (!profile && status === 'loading') {
    return (
      <PageContainer>
        <div className="text-sm text-slate-500">Загружаем профиль…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Профиль пользователя</CardTitle>
            <CardDescription>
              Изменения сохраняются через PUT-запрос к серверу.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  id="firstName"
                  label="Имя"
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...(current ?? formState),
                      firstName: value,
                    }))
                  }
                  value={formState.firstName}
                />
                <Field
                  id="lastName"
                  label="Фамилия"
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...(current ?? formState),
                      lastName: value,
                    }))
                  }
                  value={formState.lastName}
                />
              </div>

              <Field
                id="patronymic"
                label="Отчество"
                onChange={(value) =>
                  setDraft((current) => ({
                    ...(current ?? formState),
                    patronymic: value,
                  }))
                }
                value={formState.patronymic}
              />

              <Field
                id="email"
                label="Email"
                onChange={(value) =>
                  setDraft((current) => ({
                    ...(current ?? formState),
                    email: value,
                  }))
                }
                type="email"
                value={formState.email}
              />

              <Button disabled={status === 'loading'} type="submit">
                {status === 'loading' ? 'Сохраняем…' : 'Сохранить профиль'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Краткая информация</CardTitle>
            <CardDescription>
              Текущие данные авторизованного пользователя.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-medium">Полное имя:</span>{' '}
              {profile?.fullName ?? '—'}
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              {profile?.email ?? '—'}
            </p>
            <p>
              <span className="font-medium">Инициалы:</span>{' '}
              {profile?.avatarFallback ?? '—'}
            </p>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
}

function Field({ id, label, onChange, type = 'text', value }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={type !== 'text' || id !== 'patronymic'}
        type={type}
        value={value}
      />
    </div>
  );
}
