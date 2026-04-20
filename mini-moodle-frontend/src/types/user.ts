export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarFallback: string;
}

export interface UserProfile extends User {
  firstName: string;
  lastName: string;
  patronymic: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  patronymic: string;
}

export interface UpdateProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
  patronymic: string;
}

export interface AuthResponse {
  user: User;
}
