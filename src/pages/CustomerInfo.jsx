import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';
// import { ThemeContext } from '../context/ThemeContext';

const CustomerInfo = () => {
  // const { isDarkMode } = useContext(ThemeContext);
  const { walletAddress } = useContext(WalletContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    Name: '',
    email: '',
  });

  useEffect(() => {
    // Đặt lại dữ liệu form khi walletAddress thay đổi
    setFormData((prev) => ({
      ...prev,
      address: walletAddress || '',
    }));
  }, [walletAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dữ liệu gửi đi:', formData);
    // Thêm logic lưu dữ liệu vào đây (API call, localStorage, v.v.)
    navigate(-1); // Quay lại trang trước
  };

  return (
    <div className="min-h-screen flex items-top justify-center bg-white dark:bg-black">
      <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Thông Tin Khách Hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Address</label>
            <input
              type="text"
              name="address"
              value={walletAddress || ''}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Họ Và Tên</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Lưu
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerInfo;