import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: 'http://54.197.132.144:8080/api',
  timeout: 30000, // 请求超时时间
  headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
  }

});

// 请求拦截器，添加 JWT 到请求头
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 确保 headers 存在
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理响应错误
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 处理未授权错误，例如跳转到登录页面
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response && error.response.status === 403) {
      // 处理权限错误，例如跳转到权限不足页面
      window.location.href = '/403';
    } else if (error.response && error.response.status === 404) {
      // 处理未找到错误，例如跳转到 404 页面
      window.location.href = '/404';
    }
    return Promise.reject(error);
  }
);

export default http;
