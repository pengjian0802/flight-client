import React from 'react';
import { Row, Col, Typography, Space, Divider } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-8">
      <Row gutter={32}>
        <Col span={6}>
          <Title level={4}>{t('footer.company')}</Title>
          <Space direction="vertical" size="small" className="flex flex-col">
            <Text>{t('footer.aboutUs')}</Text>
            <Text>{t('footer.careers')}</Text>
            <Text>{t('footer.press')}</Text>
            <Text>{t('footer.contact')}</Text>
          </Space>
        </Col>
        <Col span={6}>
          <Title level={4}>{t('footer.help')}</Title>
          <Space direction="vertical" size="small" className="flex flex-col">
            <Text>{t('footer.faq')}</Text>
            <Text>{t('footer.accessibility')}</Text>
            <Text>{t('footer.travelAlerts')}</Text>
            <Text>{t('footer.sitemap')}</Text>
          </Space>
        </Col>
        <Col span={6}>
          <Title level={4}>{t('footer.policies')}</Title>
          <Space direction="vertical" size="small" className="flex flex-col">
            <Text>{t('footer.terms')}</Text>
            <Text>{t('footer.privacy')}</Text>
            <Text>{t('footer.cookie')}</Text>
            <Text>{t('footer.liability')}</Text>
          </Space>
        </Col>
        <Col span={6}>
          <Title level={4}>{t('footer.followUs')}</Title>
          <Space size="large">
            <FacebookOutlined className="text-xl" />
            <TwitterOutlined className="text-xl" />
            <InstagramOutlined className="text-xl" />
            <LinkedinOutlined className="text-xl" />
          </Space>
          <div className="mt-4">
            <Title level={4}>{t('footer.subscribe')}</Title>
            <Text>{t('footer.subscribeDesc')}</Text>
          </div>
        </Col>
      </Row>
      <Divider className="my-6" />
      <Row>
        <Col span={24} className="text-center" style={{ textAlign: 'center' }}>
          <Text>{t('footer.copyright')} © 2025 {t('footer.airline')}. {t('footer.allRights')}</Text>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;    