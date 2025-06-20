import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Steps,
  Typography,
  message,
  Spin,
  type FormInstance,
} from 'antd';
import { useTranslation } from 'react-i18next';
// import type { Flight } from '../models/Flight';
import bookingApi from '../services/bookingApi';
import type { Booking, BookingDetail } from '../models/Booking';
import type { PayCard } from '../models/PayCard';
import payCardApi from '../services/payCardApi';
import dayjs from 'dayjs';

const { Step } = Steps;
const { Title, Text } = Typography;
const { Option } = Select;

// 常量提取
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// 乘客信息表单组件
const PassengerInfoForm: React.FC<{
  t: (key: string) => string;
  bookingDetail: BookingDetail | null;
  onFinish: (values: any) => void;
  initialValues: any;
}> = ({ t, onFinish, initialValues }) => {
  return (
    <Form
      name="passengerInfo"
      initialValues={initialValues}
      onFinish={onFinish}
      scrollToFirstError
      {...FORM_ITEM_LAYOUT}
    >
      <Form.Item
        name="firstName"
        label={t('booking.firstName')}
        rules={[{ required: true, message: t('booking.pleaseEnterFirstName') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastName"
        label={t('booking.lastName')}
        rules={[{ required: true, message: t('booking.pleaseEnterLastName') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label={t('booking.phone')}
        rules={[
          { required: true, message: t('booking.pleaseEnterPhone') },
          { pattern: /^\+?[1-9]\d{1,14}$/, message: t('booking.invalidPhone') },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t('booking.email')}
        rules={[
          { required: true, message: t('booking.pleaseEnterEmail') },
          { type: 'email', message: t('booking.invalidEmail') },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...FORM_ITEM_LAYOUT.wrapperCol, offset: FORM_ITEM_LAYOUT.labelCol.span }}>
        <Button type="primary" htmlType="submit">
          {t('common.next')}
        </Button>
      </Form.Item>
    </Form>
  );
};

// 支付表单组件
const PaymentForm: React.FC<{
  t: (key: string) => string;
  payCards: PayCard[];
  form: FormInstance;
  onFinish: (values: any) => void;
  userId: number;
}> = ({ t, payCards, form, onFinish }) => {
  const handleSelectChange = useCallback((value: number | null) => {
    if (!value) {
      form.resetFields();
      return;
    }
    const selectedCard = payCards.find(card => card.id === value);
    if (selectedCard) {
      form.setFieldsValue({
        cardType: selectedCard.cardType,
        cardNumber: selectedCard.cardNumber,
        cvv: selectedCard.cvv,
        expiryDate: dayjs(selectedCard.expireDate),
        cardHolderName: selectedCard.cardHolderName,
      });
    }
  }, [form, payCards]);

  return (
    <Form
      form={form}
      name="payment"
      onFinish={onFinish}
      scrollToFirstError
      {...FORM_ITEM_LAYOUT}
    >
      <Form.Item
        name="id"
        label={t('booking.selectPayCard')}
      >
        <Select
          placeholder={t('booking.selectPayCard')}
          onChange={handleSelectChange}
        >
          <Option value={null}>{t('booking.addNewPayCard')}</Option>
          {payCards.map(card => (
            <Option key={card.id} value={card.id}>
              {card.cardNumber.replace(/\d{12}(\d{4})/, '************$1')}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="cardType"
        label={t('booking.cardType')}
        rules={[{ required: true, message: t('booking.pleaseSelectCardType') }]}
      >
        <Radio.Group>
          <Radio value="Visa">Visa</Radio>
          <Radio value="MasterCard">MasterCard</Radio>
          <Radio value="AmericanExpress">American Express</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="cardNumber"
        label={t('booking.cardNumber')}
        rules={[
          { required: true, message: t('booking.pleaseEnterCardNumber') },
          // { pattern: /^\d{13,19}$/, message: t('booking.invalidCardNumber') },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="expiryDate"
        label={t('booking.expiryDate')}
        rules={[
          { required: true, message: t('booking.pleaseEnterExpiryDate') },
          ({}) => ({
            validator(_, value) {
              if (dayjs(value).isBefore(dayjs())) {
                return Promise.reject(new Error(t('booking.expiredCard')));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="cvv"
        label={t('booking.cvv')}
        rules={[
          { required: true, message: t('booking.pleaseEnterCVV') },
          { pattern: /^\d{3,4}$/, message: t('booking.invalidCVV') },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="cardHolderName"
        label={t('booking.cardHolderName')}
        rules={[{ required: true, message: t('booking.pleaseEnterCardHolder') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...FORM_ITEM_LAYOUT.wrapperCol, offset: FORM_ITEM_LAYOUT.labelCol.span }}>
        <Button onClick={() => form.submit()}>{t('common.back')}</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
          {t('common.next')}
        </Button>
      </Form.Item>
    </Form>
  );
};

// 确认信息组件
const ConfirmationComponent: React.FC<{
  t: (key: string) => string;
  bookingDetail: BookingDetail | null;
  navigate: ReturnType<typeof useNavigate>;
  bookingSubmit: (values: Booking) => Promise<void>;
}> = ({ t, bookingDetail, navigate, bookingSubmit }) => {
  if (!bookingDetail) return null;

  const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm');

  const handleConfirm = async () => {
    try {
      await bookingSubmit({
        id: undefined,
        userId: bookingDetail.user.id,
        flightId: bookingDetail.flight.id,
        payCardId: bookingDetail.payCard.id,
        status: 'Confirmed',
        bookingTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        totalPrice: bookingDetail.seat.price,
        seatId: undefined,
        flightNumber: '',
        airline: '',
        departureCity: '',
        arrivalCity: '',
        departureTime: '',
        arrivalTime: '',
        price: undefined,
        seatType: ''
      });
      message.success(t('booking.bookingSuccessful'));
      navigate('/my-bookings');
    } catch (error) {
      console.error('预订提交失败:', error);
      message.error(t('booking.bookingFailed'));
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <Title level={4}>{t('booking.bookingSummary')}</Title>
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Text strong>{t('flightDetail.flightNumber')}:</Text> {bookingDetail.flight.flightNumber}
          </Col>
          <Col span={12}>
            <Text strong>{t('flightDetail.airline')}:</Text> {bookingDetail.flight.airline}
          </Col>
          <Col span={12}>
            <Text strong>{t('flightDetail.departure')}:</Text> {bookingDetail.flight.departureCity}
          </Col>
          <Col span={12}>
            <Text strong>{t('flightDetail.arrival')}:</Text> {bookingDetail.flight.arrivalCity}
          </Col>
          <Col span={12}>
            <Text strong>{t('flightDetail.departureTime')}:</Text> {formatDate(bookingDetail.flight.departureTime)}
          </Col>
          <Col span={12}>
            <Text strong>{t('flightDetail.arrivalTime')}:</Text> {formatDate(bookingDetail.flight.arrivalTime)}
          </Col>
          <Col span={12}>
            <Text strong>{t('booking.ticketType')}:</Text> {bookingDetail.seat.seatType}
          </Col>
          <Col span={12}>
            <Text strong>{t('booking.price')}:</Text> {bookingDetail.seat.price} {t('common.currency')}
          </Col>
        </Row>
      </Card>

      <Card className="mb-6">
        <Title level={4}>{t('booking.passengerDetails')}</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>{t('booking.name')}:</Text> {bookingDetail.user.firstName} {bookingDetail.user.lastName}
          </Col>
          <Col span={12}>
            <Text strong>{t('booking.email')}:</Text> {bookingDetail.user.email}
          </Col>
          <Col span={12}>
            <Text strong>{t('booking.phone')}:</Text> {bookingDetail.user.phone}
          </Col>
        </Row>
      </Card>

      <Card>
        <Title level={4}>{t('booking.paymentDetails')}</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>{t('booking.cardNumber')}:</Text>{" "}
            {bookingDetail.payCard.cardNumber.replace(/\d{12}(\d{4})/, '************$1')}
          </Col>
          <Col span={12}>
            <Text strong>{t('booking.total')}:</Text> {bookingDetail.seat.price} {t('common.currency')}
          </Col>
        </Row>
        <Row className="mt-6">
          <Col span={12}>
            <Button onClick={() => {}}>{t('common.back')}</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={handleConfirm}>
              {t('booking.confirmBooking')}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const BookingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { flightId, seatId } = useParams<{ flightId: string; seatId: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
  const [payCards, setPayCards] = useState<PayCard[]>([]);
  const [payCard, setPayCard] = useState<PayCard | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  // const [formPassengerInfo] = Form.useForm();
  const [formPayment] = Form.useForm();
  const userId = Number(localStorage.getItem('userId'));

  // 使用 useCallback 缓存异步函数
  const loadPayCards = useCallback(async () => {
    try {
      const response = await payCardApi.queryPayCards(userId);
      setPayCards(response.data || []);
      if (response.data?.length > 0) {
        formPayment.setFieldsValue({
          id: response.data[0].id,
          cardType: response.data[0].cardType,
          cardNumber: response.data[0].cardNumber,
          cvv: response.data[0].cvv,
          expiryDate: dayjs(response.data[0].expireDate),
          cardHolderName: response.data[0].cardHolderName,
        });
      }
    } catch (error) {
      console.error('加载支付卡失败:', error);
      message.error(t('booking.loadPayCardsFailed'));
    }
  }, [userId, formPayment, t]);

  const savePayCard = useCallback(async (params: PayCard) => {
    try {
      const response = await payCardApi.savePayCard(params);
      if (response.success) {
        setPayCard(response.data);
        setPayCards(prevPayCards => [...prevPayCards, response.data]);
      }
    } catch (error) {
      console.error('保存支付卡失败:', error);
      message.error(t('booking.savePayCardFailed'));
    }
  }, [t]);

  const loadBookingPreview = useCallback(async () => {
    if (!flightId || !seatId) return;
    try {
      const response = await bookingApi.queryBookingDetail({
        bookingId: undefined,
        userId,
        flightId: Number(flightId),
        seatId: Number(seatId),
      });
      setBookingDetail(response.data);
    } catch (error) {
      console.error('加载预订预览失败:', error);
      message.error(t('booking.loadBookingPreviewFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, flightId, seatId, t]);

  const bookingSubmit = useCallback(async (bookingParams: Booking) => {
    try {
      await bookingApi.saveBooking(bookingParams);
    } catch (error) {
      console.error('保存预订失败:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadPayCards();
    loadBookingPreview();
  }, [loadPayCards, loadBookingPreview]);

  const passengerInfoInitialValues = useMemo(() => ({
    phone: bookingDetail?.user?.phone,
    firstName: bookingDetail?.user?.firstName,
    lastName: bookingDetail?.user?.lastName,
    email: bookingDetail?.user?.email,
  }), [bookingDetail]);

  const steps = useMemo(() => [
    {
      title: t('booking.passengerInfo'),
      content: (
        <PassengerInfoForm
          t={t}
          bookingDetail={bookingDetail}
          onFinish={(values) => {
            if (bookingDetail) {
              const updatedUser = { ...bookingDetail.user, ...values };
              setBookingDetail({ ...bookingDetail, user: updatedUser });
              setCurrentStep(currentStep + 1);
            }
          }}
          initialValues={passengerInfoInitialValues}
        />
      ),
    },
    {
      title: t('booking.payment'),
      content: (
        <PaymentForm
          t={t}
          payCards={payCards}
          form={formPayment}
          onFinish={(values) => {
            const params: PayCard = {
              id: values.id,
              userId,
              cardType: values.cardType,
              cardNumber: values.cardNumber,
              cvv: values.cvv,
              expireDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
              cardHolderName: values.cardHolderName,
            };
            savePayCard(params);
            if (payCard && bookingDetail) {
              setBookingDetail({ ...bookingDetail, payCard });
              setCurrentStep(currentStep + 1);
            }
          }}
          userId={userId}
        />
      ),
    },
    {
      title: t('booking.confirmation'),
      content: (
        <ConfirmationComponent
          t={t}
          bookingDetail={bookingDetail}
          navigate={navigate}
          bookingSubmit={bookingSubmit}
        />
      ),
    },
  ], [
    t,
    bookingDetail,
    currentStep,
    payCards,
    formPayment,
    payCard,
    userId,
    savePayCard,
    passengerInfoInitialValues,
    navigate,
    bookingSubmit,
  ]);

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!bookingDetail) {
    return <div className="p-4">{t('booking.bookingNotFound')}</div>;
  }

  return (
    <div className="p-4">
      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="card p-4 shadow">{steps[currentStep].content}</div>
    </div>
  );
};

export default BookingPage;