import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, message } from 'antd';
import userApi from '../services/userApi';
import { useNavigate } from 'react-router-dom';
import type { RegisterRequest } from '../models/User';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { firstName: string; lastName: string; country: string; phone: string; email: string; password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        message.error(t('register.passwordMismatch'));
        return;
      }
      const registerRequest: RegisterRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        country: values.country,
        phone: values.phone,
        email: values.email,
        password: values.password
      };
      await userApi.register(registerRequest);
      message.success(t('register.success'));
      navigate('/login');
    } catch (error) {

      console.error('注册失败:', error);
      message.error(t('register.failure'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{t('register.title')}</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          label={t('register.firstName')}
          name="firstName"
          rules={[{ required: true, message: t('register.firstNameRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('register.lastName')}
          name="lastName"
          rules={[{ required: true, message: t('register.lastNameRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('register.country')}
          name="country"
          rules={[{ required: true, message: t('register.countryRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('register.phone')}
          name="phone"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('register.email')}
          name="email"
          rules={[{ required: true, message: t('register.emailRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('register.password')}
          name="password"
          rules={[{ required: true, message: t('register.passwordRequired') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t('register.confirmPassword')}
          name="confirmPassword"
          rules={[{ required: true, message: t('register.confirmPasswordRequired') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('register.register')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate('/login')}>
            {t('register.goToLogin')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;