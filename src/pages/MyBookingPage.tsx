import React, { useEffect, useState } from 'react';
import {
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { DeleteOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import bookings from '../data/bookings.json';
import type { Booking } from '../models/Booking';

const { Title } = Typography;

const MyBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // 模拟从本地存储或API获取用户预订
    setMyBookings(bookings);
  }, []);

  const handleCancelBooking = (id: string) => {
    // 模拟取消预订
    setTimeout(() => {
      setMyBookings(myBookings.filter(booking => booking.id !== id));
    }, 500);
  };

  const columns = [
    {
      title: t('myBookings.flightNumber'),
      dataIndex: 'flightNumber',
      key: 'flightNumber',
    },
    {
      title: t('myBookings.airline'),
      dataIndex: 'airline',
      key: 'airline',
    },
    {
      title: t('myBookings.departure'),
      dataIndex: 'departure',
      key: 'departure',
      render: (_, record) => (
        <div>
          <div>{record.departureCity}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(record.departureTime), 'yyyy-MM-dd HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: t('myBookings.arrival'),
      dataIndex: 'arrival',
      key: 'arrival',
      render: (_, record) => (
        <div>
          <div>{record.arrivalCity}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(record.arrivalTime), 'yyyy-MM-dd HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: t('myBookings.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        if (status === 'Cancelled') color = 'red';
        if (status === 'Completed') color = 'green';
        return <Tag color={color}>{t(`myBookings.${status.toLowerCase()}`)}</Tag>;
      },
    },
    {
      title: t('myBookings.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>
            {t('myBookings.view')}
          </Button>
          <Button type="link" icon={<DownloadOutlined />}>
            {t('myBookings.download')}
          </Button>
          {record.status === 'Confirmed' && (
            <Popconfirm
              title={t('myBookings.confirmCancel')}
              onConfirm={() => handleCancelBooking(record.id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <Button type="link" icon={<DeleteOutlined />} danger>
                {t('myBookings.cancel')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} className="mb-6">{t('myBookings.myBookings')}</Title>
      {myBookings.length > 0 ? (
        <Table dataSource={myBookings} columns={columns} rowKey="id" />
      ) : (
        <Empty description={t('myBookings.noBookings')}>
          <Button type="primary" onClick={() => window.location.href = '/'}>
            {t('myBookings.bookNow')}
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default MyBookingPage;    