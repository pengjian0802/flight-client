import React from 'react';
import { Card, Col, Row, Tag, Typography, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Flight } from '../models/Flight';

const { Text } = Typography;

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const { t } = useTranslation();

  return (
    <Card className="border rounded-lg hover:shadow-md transition-shadow">
      <Row gutter={16}>
        <Col span={18}>
          <Row>
            <Col span={6}>
              <Text strong className="text-lg">{flight.airline}</Text>
              <div className="text-sm text-gray-500">{flight.flightNumber}</div>
            </Col>
            <Col span={12} className="flex items-center justify-center">
              <div className="flex flex-col items-center w-full">
                <div className="flex w-full justify-between">
                  <div className="text-center">
                    <Text strong className="text-lg">{flight.departureCity}</Text>
                    <div className="text-sm text-gray-500">
                      {new Date(flight.departureTime).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center flex-grow px-4">
                    <div className="h-1 bg-gray-300 flex-grow" />
                    <ArrowRightOutlined className="mx-2" />
                    <div className="h-1 bg-gray-300 flex-grow" />
                  </div>
                  <div className="text-center">
                    <Text strong className="text-lg">{flight.arrivalCity}</Text>
                    <div className="text-sm text-gray-500">
                      {new Date(flight.arrivalTime).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {flight.duration} ({t('flightDetail.nonStop')})
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="flex justify-between">
                {flight.pricing.slice(0, 2).map((price, index) => (
                  <div key={index} className="text-center">
                    <Tag>{price.type}</Tag>
                    <div className="text-lg font-bold">{price.price} {t('common.currency')}</div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6} className="text-right">
          <Button type="primary" onClick={() => window.location.href = `/flights/${flight.id}`}>
            {t('home.select')}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default FlightCard;    