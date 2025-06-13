import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { WalletContext } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react'; // Use named import QRCodeSVG

const HistoryTicket = () => {
  const { walletAddress } = useContext(WalletContext);
  const [userTickets, setUserTickets] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm toggle dropdown cho từng vé
  const toggleDropdown = (ticketId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  // Hàm gọi API để lấy lịch sử vé
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
      setUserTickets(Array.isArray(data) ? data : [data]); // Đảm bảo dữ liệu là mảng
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi walletAddress thay đổi
  useEffect(() => {
    fetchTickets();
  }, [walletAddress]);

  // Hàm định dạng ngày theo múi giờ Việt Nam
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

  // Hàm định dạng trạng thái
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
            {userTickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-row items-start gap-4"
              >
                {/* Hình ảnh sự kiện bên trái */}
                {ticket.imageUrl && (
                  <div className="w-1/4 flex-shrink-0">
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.eventName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}

                {/* Nội dung vé bên phải */}
                <div className="flex-1">
                  {/* Hàng đầu tiên: Tên sự kiện bên trái, trạng thái bên phải */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200"> Vé Của Sự Kiện {ticket.eventName}</h3>
                    <p className="text-sm font-medium">
                      <span className={ticket.status === 'OWNED' ? 'text-green-500' : 'text-red-500'}>
                        {formatStatus(ticket.status)}
                      </span>
                    </p>
                  </div>

                  {/* Hàng thứ hai: Ngày mua và nút "Xem chi tiết" nằm ngang */}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ngày mua: {formatDate(ticket.purchaseDate)}
                    </p>
                    <button
                      onClick={() => toggleDropdown(ticket.ticketId)}
                      className="ml-auto bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:outline-none text-xs"
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
                      {/* <p>Transaction Hash: {ticket.txHash || 'Không có'}</p> */}
                      
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