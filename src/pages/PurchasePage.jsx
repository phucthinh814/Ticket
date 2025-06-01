import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { featuredEvents } from '../data/eventsData';

const PurchasePage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openTicketIndex, setOpenTicketIndex] = useState(null);

  // Tải thông tin sự kiện
  useEffect(() => {
    console.log('ID from useParams:', id);
    const selectedEvent = featuredEvents.find((e) => e.id === parseInt(id));
    console.log('Selected Event:', selectedEvent);
    setEvent(selectedEvent);
  }, [id]);

  // Tính tổng tiền khi danh sách vé thay đổi
  useEffect(() => {
    const total = selectedTickets.reduce(
      (sum, item) => sum + item.ticket.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [selectedTickets]);

  // Xử lý chọn loại vé
  const handleSelectTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((item) => item.ticket.name === ticket.name);
      if (existing) {
        return prev;
      }
      return [...prev, { ticket, quantity: 1 }];
    });
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (ticketName, value) => {
    const parsedValue = parseInt(value);
    setSelectedTickets((prev) => {
      if (parsedValue < 1 || isNaN(parsedValue)) {
        return prev.filter((item) => item.ticket.name !== ticketName);
      }
      if (parsedValue > 10) {
        return prev.map((item) =>
          item.ticket.name === ticketName
            ? { ...item, quantity: 10 }
            : item
        );
      }
      return prev.map((item) =>
        item.ticket.name === ticketName
          ? { ...item, quantity: parsedValue }
          : item
      );
    });
  };

  // Toggle hiển thị chi tiết vé
  const toggleTicket = (index) => {
    setOpenTicketIndex(openTicketIndex === index ? null : index);
  };

  if (!event) return <div className="text-center py-10 text-gray-700 dark:text-gray-300">Đang tải sự kiện...</div>;

  // Format thời gian từ startTime và endTime
  const formatTimeRange = () => {
    const start = event.startTime.split(' ')[1]; // Lấy giờ từ "15/6/2025 20:00" -> "20:00"
    const end = event.endTime.split(' ')[1]; // Lấy giờ từ "15/6/2025 23:00" -> "23:00"
    const date = event.startTime.split(' ')[0]; // Lấy ngày từ "15/6/2025 20:00" -> "15/6/2025"
    return `${start} - ${end}, ngày ${date}`;
  };

  return (
    <div className="bg-white dark:bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tiêu đề sự kiện với hình ảnh */}
        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-1/3">
            <img
              src={event.image || 'https://via.placeholder.com/300x200?text=Fallback+Image'}
              alt={event.name}
              className="w-full h-40 sm:h-48 object-cover rounded-lg"
              onError={(e) => {
                console.error('Image failed to load:', event.image);
                e.target.src = 'https://via.placeholder.com/300x200?text=Fallback+Image';
              }}
            />
          </div>
          <div className="w-full sm:w-2/3">
            <h1 className="text-2xl font-bold mb-2 text-white">{event.name}</h1>
            <p className="text-sm text-gray-300 dark:text-gray-200 flex items-center gap-2">
              <CalendarTodayIcon fontSize="small" /> {formatTimeRange()}
            </p>
          </div>
        </div>

        {/* Layout ngang cho Chọn loại vé và Tóm tắt đơn hàng */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Thông tin vé (bên trái) */}
          <div className="lg:w-2/3 bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Chọn loại vé</h2>
            {event.ticketTypes.map((ticket, index) => {
              const selectedItem = selectedTickets.find(
                (item) => item.ticket.name === ticket.name
              );
              const quantity = selectedItem ? selectedItem.quantity : 0;

              return (
                <div key={index} className="border-b border-gray-700 dark:border-gray-600 py-4">
                  <div
                    onClick={() => toggleTicket(index)}
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-700 px-2 py-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      {openTicketIndex === index ? <ExpandMoreIcon /> : <ArrowForwardIosIcon fontSize="small" />}
                      <span className="font-semibold">{ticket.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <span className={`${ticket.available ? 'text-green-400' : 'text-white'}`}>
                        {ticket.price.toLocaleString()} đ
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium text-white text-xs ${
                          ticket.available ? 'bg-green-600' : 'bg-red-500'
                        }`}
                      >
                        {ticket.available ? `Còn vé ` : 'Hết vé'}
                      </span>
                    </div>
                  </div>

                  {openTicketIndex === index && (
                    <div className="mt-4 bg-gray-800 dark:bg-gray-700 p-4 rounded text-sm text-gray-300 dark:text-gray-200">
                      <div className="flex flex-col md:flex-row gap-4">
                        {ticket.image && (
                          <div className="md:w-1/3 w-full">
                            <img
                              src={ticket.image}
                              alt={ticket.name}
                              className="rounded shadow w-full object-cover"
                            />
                          </div>
                        )}
                        <ul className="list-disc list-inside space-y-1 md:w-2/3">
                          {ticket.benefits.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Nút chọn và chọn số lượng */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button
                      onClick={() => handleSelectTicket(ticket)}
                      disabled={!ticket.available}
                      className={`px-4 py-2 rounded font-semibold text-white ${
                        ticket.available
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-600 dark:bg-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Chọn
                    </button>
                    {selectedItem && (
                      <div className="flex items-center gap-4">
                        <label htmlFor={`quantity-${index}`} className="text-sm text-gray-300 dark:text-gray-200">
                          Số lượng:
                        </label>
                        <input
                          id={`quantity-${index}`}
                          type="number"
                          min="0"
                          max={Math.min(10, ticket.quantity)} // Giới hạn số lượng tối đa bằng số vé còn lại
                          value={quantity}
                          onChange={(e) => handleQuantityChange(ticket.name, e.target.value)}
                          className="w-16 p-2 rounded bg-gray-700 dark:bg-gray-600 text-white border border-gray-600 dark:border-gray-500 focus:outline-none focus:border-green-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tóm tắt đơn hàng (bên phải, luôn hiển thị) */}
          <div className="lg:w-1/3 bg-gray-900 dark:bg-gray-800 rounded-xl p-6 shadow sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
            {selectedTickets.length > 0 ? (
              <div className="text-sm text-gray-300 dark:text-gray-200 space-y-4">
                {selectedTickets.map((item, index) => (
                  <div key={index} className="space-y-2 border-b border-gray-700 dark:border-gray-600 pb-2">
                    <p>
                      <span className="font-medium">Loại vé:</span> {item.ticket.name}
                    </p>
                    <p>
                      <span className="font-medium">Số lượng:</span> {item.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Giá vé:</span> {item.ticket.price.toLocaleString()} đ
                    </p>
                    <p>
                      <span className="font-medium">Tổng:</span> {(item.ticket.price * item.quantity).toLocaleString()} đ
                    </p>
                  </div>
                ))}
                <p className="text-lg font-semibold text-green-400">
                  <span className="font-medium">Tổng tiền:</span> {totalPrice.toLocaleString()} đ
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-300 dark:text-gray-200">Vui lòng chọn loại vé</p>
            )}
            <button
              className="mt-4 w-full bg-green-500 text-white px-6 py-2 rounded-lg font-semibold
                disabled:bg-gray-600 dark:disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-600"
              disabled={totalPrice === 0}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;