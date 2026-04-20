import { apiClient, unwrapPayload, unwrapNullablePayload } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types/user';

export function login(payload: LoginRequest) {
  return unwrapPayload<AuthResponse>(apiClient.post('/auth/login', payload));
}

export function register(payload: RegisterRequest) {
  return unwrapPayload<AuthResponse>(apiClient.post('/auth/register', payload));
}

export function fetchCurrentUser() {
  return unwrapPayload<AuthResponse>(apiClient.get('/auth/me'));
}

export function logout() {
  return unwrapNullablePayload(apiClient.delete('/auth/session'));
}
