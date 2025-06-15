import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { WalletContext } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';

const HistoryTicket = () => {
  const { walletAddress } = useContext(WalletContext);
  const [userTickets, setUserTickets] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleDropdown = (ticketId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const fetchTickets = async () => {
    if (!walletAddress) {
      setUserTickets([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/ticket/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu vé.');
      }

      const data = await response.json();
      console.log('Dữ liệu phản hồi từ API:', data);
      setUserTickets(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [walletAddress]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatStatus = (status) => {
    return status === 'OWNED' ? 'Chưa sử dụng' : 'Đã sử dụng';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-black dark:text-white">Vé Đang Sở Hữu</h2>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Đang tải...</p>
        ) : error ? (
          <p className="text-center text-red-500">Lỗi: {error}</p>
        ) : userTickets.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {walletAddress ? 'Bạn chưa mua vé nào.' : 'Vui lòng kết nối ví để xem lịch sử.'}
          </p>
        ) : (
          <div className="grid gap-6">
            {userTickets.slice().reverse().map((ticket) => (
              <div
                key={ticket.ticketId}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-start gap-4"
              >
                {/* Hình ảnh sự kiện */}
                {ticket.imageUrl && (
                  <div className="w-full sm:w-1/4 flex-shrink-0">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.eventName}
                      className="w-full h-48 sm:h-full object-cover rounded-md"
                    />
                  </div>
                )}

                {/* Nội dung vé */}
                <div className="flex-1 flex flex-col gap-2">
                  {/* Tên sự kiện */}
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Vé Của Sự Kiện {ticket.eventName}
                  </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ngày mua: {formatDate(ticket.purchaseDate)}
                    </p>
                  {/* Trạng thái */}
                  <p className="text-sm font-medium text-center sm:text-right">
                    <span className={ticket.status === 'OWNED' ? 'text-green-500' : 'text-red-500'}>
                      {formatStatus(ticket.status)}
                    </span>
                  </p>

                  {/* Ngày mua và nút "Xem chi tiết" */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button
                      onClick={() => toggleDropdown(ticket.ticketId)}
                      className="sm:ml-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none text-sm"
                    >
                      {openDropdowns[ticket.ticketId] ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </button>
                  </div>

                  {/* Dropdown: Các thông tin còn lại */}
                  {openDropdowns[ticket.ticketId] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-gray-600 dark:text-gray-400 text-sm"
                    >
                      {ticket.txHash && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Mã QR Vé</p>
                          <QRCodeSVG
                            value={ticket.txHash}
                            size={100}
                            bgColor={'#ffffff'}
                            fgColor={'#000000'}
                            className="mt-1"
                          />
                        </div>
                      )}
                      <p>Loại vé: {ticket.ticketName}</p>
                      <p>Giá: {ticket.price} ETH</p>
                      <p>Token ID: {ticket.tokenId}</p>
                      <p>Ngày sự kiện: {formatDate(ticket.eventDate)}</p>
                      <p>Địa điểm: {ticket.location}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTicket;