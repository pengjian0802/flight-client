import React, { useEffect, useState } from 'react';
import { Card, Col, DatePicker, Form, Row, Select, Button, Result, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
// import flights from '../data/flights.json';
import FlightCard from '../components/FlightCard';
import type { Flight } from '../models/Flight';
import dayjs from 'dayjs'; 
import flightApi from '../services/flightApi';
import type { QueryFlightListRequest } from '../models/Flight';

// const { RangePicker } = DatePicker;
const { Option } = Select;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    loadFlights({
        departureCity: '',
        arrivalCity: '',
        departureDate:  '',
        passengers: 1,
      });
  }, []);

  const loadFlights = async (queryParams: QueryFlightListRequest) => {
    const response = await flightApi.queryFlights(queryParams);
    setSearchResults(response.data || []);
    setSearchPerformed(true);
  }

  const onFinish = async (values: any) => {
    // 模拟搜索航班
    await loadFlights({
      departureCity: values.from,
      arrivalCity: values.to,
      departureDate: dayjs(values.dates).format('YYYY-MM-DD'),
      passengers: values.passengers,
    });
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
              >
                <Select placeholder={t('home.selectCity')}>
                  <Option value="Beijing">{t('city.Beijing')}</Option>
                  <Option value="Shanghai">{t('city.Shanghai')}</Option>
                  <Option value="Guangzhou">{t('city.Guangzhou')}</Option>
                  <Option value="Shenzhen">{t('city.Shenzhen')}</Option>
                  <Option value="Chengdu">{t('city.Chengdu')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} sm={12} lg={6}>
              <Form.Item
                label={t('home.departureDate')}
                name="dates"
              >
                <DatePicker
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