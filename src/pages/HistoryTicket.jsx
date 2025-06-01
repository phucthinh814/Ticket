import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { WalletContext } from '../context/WalletContext'; // Đảm bảo đường dẫn đúng
import { purchasedTickets } from '../data/eventsData'; // Đảm bảo đường dẫn đúng

const HistoryTicket = () => {
  const { walletAddress } = useContext(WalletContext); // Lấy địa chỉ wallet hiện tại
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Hàm toggle dropdown cho từng vé
  const toggleDropdown = (ticketId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  // Lọc vé dựa trên walletAddress hiện tại
  const userTickets = walletAddress
    ? purchasedTickets.filter((ticket) => ticket.walletAddress === walletAddress)
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-black dark:text-white">Lịch Sử Mua Vé</h2>
        {userTickets.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {walletAddress ? 'Bạn chưa mua vé nào.' : 'Vui lòng kết nối ví để xem lịch sử.'}
          </p>
        ) : (
          <div className="grid gap-6">
            {userTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                {/* Hàng đầu tiên: Tên sự kiện bên trái, trạng thái bên phải */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{ticket.eventName}</h3>
                  <p className="text-sm font-medium">
                    <span className={ticket.status === 'Đã sử dụng' ? 'text-red-500' : 'text-green-500'}>
                      {ticket.status}
                    </span>
                  </p>
                </div>

                {/* Hàng thứ hai: Ngày mua và nút "Xem chi tiết" nằm ngang */}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ngày mua: {ticket.purchaseDate}</p>
                  <button
                    onClick={() => toggleDropdown(ticket.id)}
                    className="ml-auto bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:outline-none text-xs"
                  >
                    {openDropdowns[ticket.id] ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>

                {/* Dropdown: Các thông tin còn lại */}
                {openDropdowns[ticket.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-gray-600 dark:text-gray-400 text-sm"
                  >
                    <p>Loại vé: {ticket.ticketName}</p>
                    <p>Giá: {ticket.price.toLocaleString('vi-VN')} VNĐ</p>
                    <p>Ngày sự kiện: {ticket.eventDate}</p>
                    <p>Địa điểm: {ticket.location}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTicket;