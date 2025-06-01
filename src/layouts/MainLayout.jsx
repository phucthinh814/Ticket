import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* Nội dung của các trang sẽ được render tại đây */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;