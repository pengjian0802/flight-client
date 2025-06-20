import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
// import flights from '../data/flights.json';
import type { FlightDetail } from '../models/Flight';
import flightApi from '../services/flightApi';

const { Title, Text } = Typography;

const FlightDetailPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [flightDetail, setFlightDetail] = useState<FlightDetail | null>(null);

  const loadFlightDetail = async () => {
    if (!id) {
      return;
    }
    const response = await flightApi.queryFlightDetail(id);
    setFlightDetail(response.data || null);
  }

  useEffect(() => {
    loadFlightDetail();
  }, [id]);

  if (!flightDetail) {
    return <div></div>;
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
                <Text strong>{t('flightDetail.flightNumber')}:</Text> {flightDetail.flightNumber}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.airline')}:</Text> {flightDetail.airline}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.departure')}:</Text> {flightDetail.departureCity}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.arrival')}:</Text> {flightDetail.arrivalCity}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.departureTime')}:</Text>{' '}
                {new Date(flightDetail.departureTime).toLocaleString()}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.arrivalTime')}:</Text>{' '}
                {new Date(flightDetail.arrivalTime).toLocaleString()}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.duration')}:</Text> {flightDetail.duration}
              </Col>
              <Col span={12}>
                <Text strong>{t('flightDetail.aircraft')}:</Text> {flightDetail.aircraft}
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
          {flightDetail.seats.map((flightSeat, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <Row>
                <Col span={18}>
                  <Row>
                    <Col span={24}>
                      <Text strong className="text-lg">{flightSeat.seatType}</Text>
                      <Tag className="ml-2">{t(`flightDetail.${flightSeat.seatType.toLowerCase()}`)}</Tag>
                    </Col>
                    <Col span={24} className="mt-2">
                      <Text>{flightSeat.seatNumber}</Text>
                    </Col>
                  </Row>
                </Col>
                <Col span={6} className="text-right">
                  <Text strong className="text-xl">{flightSeat.price} {t('common.currency')}</Text>
                  <div className="mt-2">
                    <Button
                      type="primary"
                      onClick={() => window.location.href = `/booking/${flightDetail.id}/${flightSeat.id}`}
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
            <Text strong className="text-lg">{flightDetail.departureCity}</Text>
            <div className="text-sm text-gray-500">
              {new Date(flightDetail.departureTime).toLocaleTimeString()}
            </div>
          </div>
          <div className="flex-2 flex items-center justify-center">
            <ArrowRightOutlined className="text-2xl mr-2" />
            <div className="h-1 bg-gray-300 flex-grow" />
            <ArrowRightOutlined className="text-2xl ml-2" />
          </div>
          <div className="flex-1 text-center">
            <Text strong className="text-lg">{flightDetail.arrivalCity}</Text>
            <div className="text-sm text-gray-500">
              {new Date(flightDetail.arrivalTime).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <Divider />
        <div className="text-center">
          <Text strong>{flightDetail.duration}</Text>
        </div>
      </Card>
    </div>
  );
};

export default FlightDetailPage;    