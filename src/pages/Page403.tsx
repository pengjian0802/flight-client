import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title, Text } = Typography;

const Page403: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Title level={1}>{t('error.403.title')}</Title>
      <Text type="danger" style={{ fontSize: 18, marginBottom: 24 }}>{t('error.403.message')}</Text>
      <Button type="primary" size="large" onClick={handleGoHome}>
        {t('error.403.goHome')}
      </Button>
    </div>
  );
};

export default Page403;