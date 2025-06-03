import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpecialEvents from '../components/SpecialEvents';
import { locations } from '../data/eventsData';
import { WalletContext } from '../context/WalletContext';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connectWallet, checkConnectionStatus } = useContext(WalletContext);
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openTicketIndex, setOpenTicketIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  // Fetch event and ticket types
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();

        // Fetch ticket types
        const ticketResponse = await fetch(`http://localhost:8080/api/ticket-types/event/${id}`);
        if (!ticketResponse.ok) {
          throw new Error('Failed to fetch ticket types');
        }
        const ticketData = await ticketResponse.json();

        // Map event data
        const mappedEvent = {
          id: eventData.eventId,
          name: eventData.eventName,
          image: eventData.imageUrl || 'https://via.placeholder.com/300x200?text=Fallback+Image',
          startTime: eventData.dateStart,
          endTime: eventData.dateEnd,
        };

        // Map ticket types
        const mappedTicketTypes = ticketData.map((ticket) => ({
          name: ticket.name,
          price: ticket.price, // Keep price in ETH
          available: ticket.remainingAmount > 0,
          benefits: ticket.benefits || [], // Default to empty array if benefits is null
          remainingAmount: ticket.remainingAmount,
        }));

        setEvent(mappedEvent);
        setTicketTypes(mappedTicketTypes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Map API data to match expected structure
        const mappedEvents = data.map(event => ({
          id: event.event_id,
          name: event.event_name,
          description: event.description,
          image: event.image_url,
          location: event.location,
          date_start: event.date_start,
          date_end: event.date_end,
          status: event.status,
        }));
        setEvents(mappedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  // Calculate total price when selected tickets change
  useEffect(() => {
    const total = selectedTickets.reduce(
      (sum, item) => sum + item.ticket.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [selectedTickets]);

  // Handle ticket selection
  const handleSelectTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((item) => item.ticket.name === ticket.name);
      if (existing) {
        return prev;
      }
      return [...prev, { ticket, quantity: 1 }];
    });
  };

  // Handle quantity change
  const handleQuantityChange = (ticketName, value) => {
    const parsedValue = parseInt(value);
    const ticket = ticketTypes.find((t) => t.name === ticketName);
    setSelectedTickets((prev) => {
      if (parsedValue < 1 || isNaN(parsedValue)) {
        return prev.filter((item) => item.ticket.name !== ticketName);
      }
      if (parsedValue > ticket.remainingAmount) {
        toast.warning(`Chỉ còn ${ticket.remainingAmount} vé cho ${ticketName}!`, {
          position: 'top-center',
          autoClose: 2000,
        });
        return prev.map((item) =>
          item.ticket.name === ticketName
            ? { ...item, quantity: ticket.remainingAmount }
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

  // Handle payment
  const handlePayment = async () => {
    const isActuallyConnected = await checkConnectionStatus();
    if (!isActuallyConnected) {
      toast.warning('Vui lòng kết nối ví MetaMask để thanh toán!', {
        position: 'top-center',
        autoClose: 2000,
      });
      const connected = await connectWallet();
      if (!connected) {
        return;
      }
    }
    // Placeholder for payment logic
    toast.success('Thanh toán thành công! (Placeholder)', {
      position: 'top-center',
      autoClose: 2000,
    });
    navigate(`/event/${id}`);
  };

  // Toggle ticket details
  const toggleTicket = (index) => {
    setOpenTicketIndex(openTicketIndex === index ? null : index);
  };

  // Format time range from ISO date strings
  const formatTimeRange = () => {
    if (!event || !event.startTime || !event.endTime) return '';
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (date) => date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);
    const date = formatDate(startDate);
    return `${startTime} - ${endTime}, ngày ${date}`;
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-700 dark:text-gray-300">Đang tải sự kiện...</div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-10 text-gray-700 dark:text-gray-300">
        {error || 'Sự kiện không tồn tại.'}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tiêu đề sự kiện với hình ảnh */}
        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-1/3">
            <img
              src={event.image}
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
            {ticketTypes.map((ticket, index) => {
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
                        {ticket.price} ETH
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium text-white text-xs ${
                          ticket.available ? 'bg-green-600' : 'bg-red-500'
                        }`}
                      >
                        {ticket.available ? `Còn ${ticket.remainingAmount} vé` : 'Hết vé'}
                      </span>
                    </div>
                  </div>

                  {openTicketIndex === index && (
                    <div className="mt-4 bg-gray-800 dark:bg-gray-700 p-4 rounded text-sm text-gray-300 dark:text-gray-200">
                      {ticket.benefits.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {ticket.benefits.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>Loại vé không có lợi ích</p>
                      )}
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
                          max={ticket.remainingAmount}
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
                      <span className="font-medium">Giá vé:</span> {item.ticket.price} ETH
                    </p>
                    <p>
                      <span className="font-medium">Tổng:</span> {(item.ticket.price * item.quantity)} ETH
                    </p>
                  </div>
                ))}
                <p className="text-lg font-semibold text-green-400">
                  <span className="font-medium">Tổng tiền:</span> {totalPrice} ETH
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-300 dark:text-gray-200">Vui lòng chọn loại vé</p>
            )}
            <button
              onClick={handlePayment}
              className="mt-4 w-full bg-green-500 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-600 dark:disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-600"
              disabled={totalPrice === 0}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      {/* Special Events */}
      <SpecialEvents events={events} />
        {/* Điểm đến thú vị */}
        <section className="max-w-7xl text-black dark:text-white mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4">Điểm đến thú vị</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-lg h-[350px] relative"
              >
                <div className="relative w-full h-full">
                  <img
                    src={location.image}
                    alt={location.title}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      console.error('Location image failed to load:', location.image);
                      e.target.src = 'https://via.placeholder.com/300x350?text=Fallback+Image';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-opacity-60 p-4">
                    <h3 className="text-2xl font-semibold text-white">{location.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
export default PurchasePage;