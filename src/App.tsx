import React from 'react';
import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FlightDetailPage from './pages/FlightDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingPage from './pages/MyBookingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const { Header, Content, Footer: LayoutFooter } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="min-h-screen flex flex-col"> 
      <Header className="bg-white shadow-md sticky top-0 z-50 py-2 px-4 sm:px-6 lg:px-8" style={{ background: '#ffffff' }}>
        <Navbar />
      </Header>
      <Content className="flex-grow"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/flights/:id" element={<FlightDetailPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingPage />} />
          </Routes>
        </div>
      </Content>
      {/* <LayoutFooter className="bg-gray-50 border-t border-gray-200">
        <Footer />
      </LayoutFooter> */}
    </Layout>
  );
};

export default App;