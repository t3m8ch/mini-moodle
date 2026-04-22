import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAppDispatch } from '../../store/hooks';
import { clearError } from '../../store/settingsSlice';
import { sessionExpired } from '../../store/userSlice';

const AUTH_REDIRECT_EXCLUDED_PATHS = [
  '/auth/me',
  '/auth/login',
  '/auth/register',
] as const;

export function useAxiosInterceptorBridge() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let sessionRedirectInProgress = false;

    const interceptorId = apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError & { __sessionRedirectHandled?: boolean }) => {
        const shouldHandleSessionExpired =
          error.response?.status === 401 &&
          !AUTH_REDIRECT_EXCLUDED_PATHS.some((path) =>
            error.config?.url?.startsWith(path),
          );

        if (shouldHandleSessionExpired) {
          error.__sessionRedirectHandled = true;

          if (!sessionRedirectInProgress) {
            sessionRedirectInProgress = true;
            dispatch(clearError());
            dispatch(sessionExpired());
            navigate('/login', {
              replace: true,
              state: { from: { pathname: location.pathname } },
            });
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(interceptorId);
    };
  }, [dispatch, location.pathname, navigate]);
}
