import React, { useState } from 'react';
import { Card, Col, DatePicker, Form, Row, Select, Button, Result, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import flights from '../data/flights.json';
import FlightCard from '../components/FlightCard';
import type { Flight } from '../models/Flight';
import dayjs from 'dayjs'; 

const { RangePicker } = DatePicker;
const { Option } = Select;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const onFinish = (values: any) => {
    // 模拟搜索航班
    const results = flights.filter(flight => {
      return (
        flight.departureCity === values.from &&
        flight.arrivalCity === values.to &&
        (values.dates ? 
          new Date(flight.departureTime).toDateString() === new Date(values.dates[0]).toDateString() : 
          true)
      );
    });

    setSearchResults(results);
    setSearchPerformed(true);
  };

  return (
    <div>
      <Card className="mb-8">
        <Form
          name="flight_search"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            tripType: 'oneWay',
          }}
        >
          <Row gutter={16}>
            <Col span={24} sm={12} lg={6}>
              <Form.Item
                label={t('home.from')}
                name="from"
                rules={[{ required: true, message: t('home.pleaseSelectDeparture') }]}
              >
                <Select placeholder={t('home.selectCity')}>
                  <Option value="Beijing">Beijing</Option>
                  <Option value="Shanghai">Shanghai</Option>
                  <Option value="Guangzhou">Guangzhou</Option>
                  <Option value="Shenzhen">Shenzhen</Option>
                  <Option value="Chengdu">Chengdu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} sm={12} lg={6}>
              <Form.Item
                label={t('home.to')}
                name="to"
                rules={[{ required: true, message: t('home.pleaseSelectDestination') }]}
              >
                <Select placeholder={t('home.selectCity')}>
                  <Option value="Beijing">Beijing</Option>
                  <Option value="Shanghai">Shanghai</Option>
                  <Option value="Guangzhou">Guangzhou</Option>
                  <Option value="Shenzhen">Shenzhen</Option>
                  <Option value="Chengdu">Chengdu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} sm={12} lg={6}>
              <Form.Item
                label={t('home.departureDate')}
                name="dates"
                rules={[{ required: true, message: t('home.pleaseSelectDate') }]}
              >
                <RangePicker
                  defaultValue={[dayjs(), dayjs().add(1, 'day')]}
                  showTime={false}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} lg={6}>
              <Form.Item
                label={t('home.passengers')}
                name="passengers"
                initialValue={1}
              >
                <Select>
                  {Array.from({ length: 9 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>
                      {i + 1} {t('common.passengers')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                size="large"
              >
                {t('home.searchFlights')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {searchPerformed && (
        <div>
          {searchResults.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-4">{t('home.searchResults')}</h2>
              <Space direction="vertical" size="large" className="w-full">
                {searchResults.map(flight => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </Space>
            </div>
          ) : (
            <Result
              status="warning"
              title={t('home.noFlightsFound')}
              subTitle={t('home.tryAdjustingYourSearch')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;    