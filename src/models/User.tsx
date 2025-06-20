export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  phone: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

