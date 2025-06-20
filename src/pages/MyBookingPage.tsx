import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import type { Booking } from '../models/Booking';
import bookingApi from '../services/bookingApi';

const { Title } = Typography;

// 提取状态颜色映射逻辑为常量
const STATUS_COLOR_MAP: Record<string, string> = {
  Cancelled: 'red',
  Completed: 'green',
  default: 'blue',
};

// 提取表格列配置为独立函数
const getColumns = (t: (key: string) => string, handleCancelBooking: (id: number) => void) => [
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
    render: (_: any, record: Booking) => (
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
    // 明确指定 record 类型为 Booking
    render: (_: any, record: Booking) => (
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
    render: (status: string) => {
      const color = STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP.default;
      return <Tag color={color}>{t(`myBookings.${status.toLowerCase()}`)}</Tag>;
    },
  },
  {
    title: t('myBookings.actions'),
    key: 'actions',
    // 明确指定 record 类型为 Booking
    render: (_: any, record: Booking) => (
      <Space>
        <Button type="link" icon={<EyeOutlined />}>
          {t('myBookings.view')}
        </Button>
        {record.status === 'Confirmed' && (
          <Popconfirm
            title={t('myBookings.confirmCancel')}
            onConfirm={() => handleCancelBooking(Number(record.id))}
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

const MyBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = Number(localStorage.getItem('userId'));

  // 使用 useCallback 缓存加载预订列表的函数
  const loadBookingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await bookingApi.queryBookingList(userId);
      setMyBookings(response.data || []);
    } catch (error) {
      console.error('加载预订列表失败:', error);
      message.error(t('myBookings.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    loadBookingList();
  }, [loadBookingList]);

  // 使用 useCallback 缓存取消预订的函数
  const handleCancelBooking = useCallback(async (id: number) => {
    try {
      await bookingApi.updateStatus(id, "Cancelled");
      message.success(t('myBookings.cancelSuccess'));
      loadBookingList();
    } catch (error) {
      console.error('取消预订失败:', error);
      message.error(t('myBookings.cancelFailed'));
    }
  }, [loadBookingList, t]);

  const columns = getColumns(t, handleCancelBooking);

  return (
    <div>
      <Title level={2} className="mb-6">{t('myBookings.myBookings')}</Title>
      {myBookings.length > 0 ? (
        <Table
          dataSource={myBookings}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
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