export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
