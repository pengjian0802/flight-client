import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import flights from '../data/flights.json';
import type { Flight } from '../models/Flight';

const { Title, Text } = Typography;

const FlightDetailPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [flight, setFlight] = useState<Flight | null>(null);

  useEffect(() => {
    const selectedFlight = flights.find(f => f.id === id);
    setFlight(selectedFlight || null);
  }, [id]);

  if (!flight) {
    return <div>{t('flightDetail.flightNotFound')}</div>;
  }

  return (
    <div>
      <Card className="mb-6">
        <Row>
          <Col span={24}>
            <Title level={3} className="mb-4">
              {t('flightDetail.flightDetails')}
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>{t('flightDetail.flightNumber')}:</Text> {flight.flightNumber}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.airline')}:</Text> {flight.airline}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.departure')}:</Text> {flight.departureCity}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.arrival')}:</Text> {flight.arrivalCity}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.departureTime')}:</Text>{' '}
                {new Date(flight.departureTime).toLocaleString()}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.arrivalTime')}:</Text>{' '}
                {new Date(flight.arrivalTime).toLocaleString()}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.duration')}:</Text> {flight.duration}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.aircraft')}:</Text> {flight.aircraft}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card className="mb-6">
        <Title level={3} className="mb-4">
          {t('flightDetail.priceOptions')}
        </Title>
        <Space direction="vertical" size="large" className="w-full">
          {flight.pricing.map((price, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <Row>
                <Col span={18}>
                  <Row>
                    <Col span={24}>
                      <Text strong className="text-lg">{price.type}</Text>
                      <Tag className="ml-2">{t(`flightDetail.${price.type.toLowerCase()}`)}</Tag>
                    </Col>
                    <Col span={24} className="mt-2">
                      <Text>{price.description}</Text>
                    </Col>
                  </Row>
                </Col>
                <Col span={6} className="text-right">
                  <Text strong className="text-xl">{price.price} {t('common.currency')}</Text>
                  <div className="mt-2">
                    <Button
                      type="primary"
                      onClick={() => window.location.href = `/booking/${flight.id}?type=${price.type}`}
                    >
                      {t('flightDetail.select')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </Space>
      </Card>

      <Card>
        <Title level={3} className="mb-4">
          {t('flightDetail.flightRoute')}
        </Title>
        <div className="flex items-center justify-between py-8">
          <div className="flex-1 text-center">
            <Text strong className="text-lg">{flight.departureCity}</Text>
            <div className="text-sm text-gray-500">
              {new Date(flight.departureTime).toLocaleTimeString()}
            </div>
          </div>
          <div className="flex-2 flex items-center justify-center">
            <ArrowRightOutlined className="text-2xl mr-2" />
            <div className="h-1 bg-gray-300 flex-grow" />
            <ArrowRightOutlined className="text-2xl ml-2" />
          </div>
          <div className="flex-1 text-center">
            <Text strong className="text-lg">{flight.arrivalCity}</Text>
            <div className="text-sm text-gray-500">
              {new Date(flight.arrivalTime).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <Divider />
        <div className="text-center">
          <Text strong>{flight.duration}</Text>
        </div>
      </Card>
    </div>
  );
};

export default FlightDetailPage;    