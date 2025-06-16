import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
  message,
} from 'antd';
import { CreditCardOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import flights from '../data/flights.json';
import type { Flight } from '../models/Flight';

const { Step } = Steps;
const { Title, Text } = Typography;
const { Option } = Select;

const BookingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>({});

  const flightId = searchParams.get('id');
  const ticketType = searchParams.get('type');

  const flight = flights.find(f => f.id === flightId) as Flight;
  const ticket = flight?.pricing.find(p => p.type === ticketType);

  const steps = [
    {
      title: t('booking.passengerInfo'),
      content: (
        <Form
          name="passengerInfo"
          onFinish={(values) => {
            setBookingData({ ...bookingData, passenger: values });
            setCurrentStep(currentStep + 1);
          }}
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                rules={[{ required: true, message: t('booking.pleaseSelectTitle') }]}
              >
                <Select placeholder={t('booking.title')}>
                  <Option value="Mr">{t('booking.mr')}</Option>
                  <Option value="Mrs">{t('booking.mrs')}</Option>
                  <Option value="Ms">{t('booking.ms')}</Option>
                  <Option value="Dr">{t('booking.dr')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: t('booking.pleaseEnterPhone') }]}
              >
                <Input placeholder={t('booking.phone')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: t('booking.pleaseEnterFirstName') }]}
              >
                <Input placeholder={t('booking.firstName')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: t('booking.pleaseEnterLastName') }]}
              >
                <Input placeholder={t('booking.lastName')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: t('booking.pleaseEnterEmail') },
                  { type: 'email', message: t('booking.invalidEmail') },
                ]}
              >
                <Input placeholder={t('booking.email')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="passport"
                rules={[{ required: true, message: t('booking.pleaseEnterPassport') }]}
              >
                <Input placeholder={t('booking.passportNumber')} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="text-right">
              <Button type="primary" htmlType="submit">
                {t('common.next')}
              </Button>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: t('booking.payment'),
      content: (
        <Form
          name="payment"
          onFinish={(values) => {
            setBookingData({ ...bookingData, payment: values });
            setCurrentStep(currentStep + 1);
          }}
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="cardType"
                rules={[{ required: true, message: t('booking.pleaseSelectCardType') }]}
              >
                <Radio.Group>
                  <Radio value="visa">Visa</Radio>
                  <Radio value="mastercard">MasterCard</Radio>
                  <Radio value="amex">American Express</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="cardNumber"
                rules={[{ required: true, message: t('booking.pleaseEnterCardNumber') }]}
              >
                <Input placeholder={t('booking.cardNumber')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expiryDate"
                rules={[{ required: true, message: t('booking.pleaseEnterExpiryDate') }]}
              >
                <Input placeholder={t('booking.expiryDate')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cvv"
                rules={[{ required: true, message: t('booking.pleaseEnterCVV') }]}
              >
                <Input placeholder={t('booking.cvv')} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="cardHolder"
                rules={[{ required: true, message: t('booking.pleaseEnterCardHolder') }]}
              >
                <Input placeholder={t('booking.cardHolderName')} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                {t('common.back')}
              </Button>
            </Col>
            <Col span={12} className="text-right">
              <Button type="primary" htmlType="submit">
                {t('common.confirm')}
              </Button>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: t('booking.confirmation'),
      content: (
        <div>
          <Card className="mb-6">
            <Title level={4}>{t('booking.bookingSummary')}</Title>
            <Row gutter={16} className="mb-4">
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
                <Text strong>{t('booking.ticketType')}:</Text> {ticket?.type}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.price')}:</Text> {ticket?.price} {t('common.currency')}
              </Col>
            </Row>
          </Card>

          <Card className="mb-6">
            <Title level={4}>{t('booking.passengerDetails')}</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>{t('booking.name')}:</Text>{' '}
                {bookingData.passenger?.title} {bookingData.passenger?.firstName}{' '}
                {bookingData.passenger?.lastName}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.email')}:</Text> {bookingData.passenger?.email}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.phone')}:</Text> {bookingData.passenger?.phone}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.passport')}:</Text> {bookingData.passenger?.passport}
              </Col>
            </Row>
          </Card>

          <Card>
            <Title level={4}>{t('booking.paymentDetails')}</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>{t('booking.cardType')}:</Text> {bookingData.payment?.cardType}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.cardHolder')}:</Text> {bookingData.payment?.cardHolder}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.cardNumber')}:</Text>{" "}
                {bookingData.payment?.cardNumber?.replace(/\d{12}(\d{4})/, '************$1')}
              </Col>
              <Col span={12}>
                <Text strong>{t('booking.total')}:</Text> {ticket?.price} {t('common.currency')}
              </Col>
            </Row>
            <Row className="mt-6">
              <Col span={12}>
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  {t('common.back')}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  onClick={() => {
                    // 模拟提交订单
                    setTimeout(() => {
                      message.success(t('booking.bookingSuccessful'));
                      navigate('/my-bookings');
                    }, 1000);
                  }}
                >
                  {t('booking.confirmBooking')}
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="card">{steps[currentStep].content}</div>
    </div>
  );
};

export default BookingPage;    