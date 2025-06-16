import http from './http';
import type { ApiResponse } from '../models/Common';
import type { LoginRequest, RegisterRequest } from '../models/User';

const login = async (values: LoginRequest): Promise<ApiResponse> => {
  const response = await http.post<ApiResponse>('/auth/login', values);
  return response.data;
};

const register = async (values: RegisterRequest): Promise<ApiResponse> => {
  const response = await http.post<ApiResponse>('/auth/register', values);
  return response.data;
};

export default {
  login,
  register,
};