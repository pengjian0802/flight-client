import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, message } from 'antd';
import userApi from '../services/userApi';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../models/User';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const LoginRequest: LoginRequest = {
        email: values.email,
        password: values.password,
      };
      const response = await userApi.login(LoginRequest); // 替换为实际的登录 API 路径
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      message.success(t('login.success'));
      navigate('/');
    } catch (error) {
      console.error('登录失败:', error);
      message.error(t('login.failure'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{t('login.title')}</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          label={t('login.email')}
          name="email"
          rules={[{ required: true, message: t('login.emailRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('login.password')}
          name="password"
          rules={[{ required: true, message: t('login.passwordRequired') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('login.login')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate('/register')}>
            {t('login.goToRegister')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;