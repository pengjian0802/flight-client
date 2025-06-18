import React, { useState } from 'react';
import { Menu, Dropdown, Button, Space, Select, type MenuProps } from 'antd';
import { UserOutlined, DownOutlined, GlobalOutlined, RocketOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// 定义菜单项类型
type MenuItem = NonNullable<MenuProps['items']>[number];

// 提取公共样式类
const COMMON_ITEM_CLASS = 'font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200';
const COMMON_SELECTED_CLASS = 'text-blue-600 border-b-2 border-blue-600';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState<string>('home');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 点击事件处理函数
  const handleClick = (e: { key: string }) => {
    if (e.key === 'language') return;
    setCurrent(e.key);
    navigate(`/${e.key === 'home' ? '' : e.key}`);
  };

  // 语言切换函数
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // 定义用户菜单项目
  const userMenuItems: MenuItem[] = [
    {
      key: 'profile',
      label: (
        <Button
          type="link"
          onClick={() => navigate('/profile')}
          className={COMMON_ITEM_CLASS}
        >
          {t('navbar.myProfile')}
        </Button>
      ),
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      key: 'logout',
      label: (
        <Button
          type="link"
          danger
          onClick={() => {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className={COMMON_ITEM_CLASS}
        >
          {t('navbar.logout')}
        </Button>
      ),
    },
  ];

  // 使用 menu 属性替代 overlay
  const userMenu = { items: userMenuItems };

  // 生成主菜单项目的标签
  const createMainMenuLabel = (icon: React.ReactNode, text: string) => (
    <Space>
      {icon}
      {text}
    </Space>
  );

  // 定义主菜单项目
  const mainMenuItems: MenuItem[] = [
    {
      key: 'home',
      label: createMainMenuLabel(<GlobalOutlined />, t('navbar.home')),
    },
    ...(isLoggedIn ? [
      {
        key: 'my-bookings',
        label: createMainMenuLabel(<RocketOutlined />, t('navbar.myBookings')),
      },
    ] : []),
    {
      key: 'language',
      label: (
        <Select
          value={i18n.language}
          onChange={changeLanguage}
          size="small"
          style={{ width: 100 }}
        >
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="zh">中文</Select.Option>
        </Select>
      ),
    },
    ...(isLoggedIn ? [
      {
        key: 'user',
        label: (
          <Dropdown menu={userMenu} trigger={['click']}>
            <Button type="link">
              <Space>
                <UserOutlined />
                {t('navbar.myAccount')}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        ),
      },
    ] : [
      {
        key: 'login',
        label: (
          <Button
            type="primary"
            onClick={() => navigate('/login')}
          >
            {t('navbar.login')}
          </Button>
        ),
      },
    ]),
  ].map(item => ({
    ...item,
    label: (
      <div
        className={`${COMMON_ITEM_CLASS} ${item.key === current ? COMMON_SELECTED_CLASS : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (item.key !== 'language') {
            handleClick({ key: item.key });
          }
        }}
      >
        {item.label}
      </div>
    ),
  }));

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[current]}
      onClick={handleClick}
      items={mainMenuItems}
      className="bg-white shadow-sm h-16 flex items-center px-4 sm:px-6 lg:px-8"
    />
  );
};

export default Navbar;