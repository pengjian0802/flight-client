import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'antd/dist/reset.css';
import './i18n';
import { useTranslation } from 'react-i18next';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const MainApp: React.FC = () => {
  const { i18n } = useTranslation();
  const antdLocale = i18n.language === 'en' ? enUS : zhCN;

  return (
    <React.StrictMode>
      <ConfigProvider locale={antdLocale}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
};

root.render(<MainApp />);