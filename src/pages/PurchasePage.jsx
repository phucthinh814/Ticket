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
import { buyMultipleTickets } from '../utils/web3';

const PurchasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connectWallet, checkConnectionStatus, walletAddress, web3 } = useContext(WalletContext);
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openTicketIndex, setOpenTicketIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();

        const ticketResponse = await fetch(`http://localhost:8080/api/ticket-types/event/${id}`);
        if (!ticketResponse.ok) {
          throw new Error('Failed to fetch ticket types');
        }
        const ticketData = await ticketResponse.json();

        const mappedEvent = {
          id: eventData.eventId,
          name: eventData.eventName,
          image: eventData.imageUrl || 'https://via.placeholder.com/300x200?text=Fallback+Image',
          startTime: eventData.dateStart,
          endTime: eventData.dateEnd,
        };

        const mappedTicketTypes = ticketData.map((ticket) => ({
          ticketTypeId: ticket.ticketTypeId,
          name: ticket.name,
          price: ticket.price,
          available: ticket.remainingAmount > 0,
          benefits: ticket.benefits || [],
          remainingAmount: ticket.remainingAmount,
          metadataURI: ticket.metadataURI || '',
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

  useEffect(() => {
    const total = selectedTickets.reduce(
      (sum, item) => sum + item.ticket.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [selectedTickets]);

  const handleSelectTicket = (ticket) => {
    setSelectedTickets((prev) => {
      const existing = prev.find((item) => item.ticket.name === ticket.name);
      if (existing) {
        return prev;
      }
      return [...prev, { ticket, quantity: 1 }];
    });
  };

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

  const handlePayment = async () => {
    try {
      setIsPaymentProcessing(true); // Bật màn hình chờ
      const isConnected = await checkConnectionStatus();
      if (!isConnected || !web3 || !walletAddress) {
        toast.warning('Vui lòng kết nối ví MetaMask để thanh toán!', {
          position: 'top-center',
          autoClose: 2000,
        });
        const connected = await connectWallet();
        if (!connected) {
          setIsPaymentProcessing(false); // Tắt màn hình chờ nếu không kết nối
          return;
        }
      }

      const ticketTypeIds = selectedTickets.map((item) => item.ticket.ticketTypeId);
      const quantities = selectedTickets.map((item) => item.quantity);
      const totalPriceInWei = web3.utils.toWei(totalPrice.toString(), 'ether');

      // In dữ liệu đầu vào để debug
      console.log('Dữ liệu giao dịch:', {
        eventId: event.id,
        ticketTypeIds,
        quantities,
        totalPriceInWei: web3.utils.fromWei(totalPriceInWei, 'ether'),
        walletAddress,
      });

      const tx = await buyMultipleTickets(
        event.id,
        ticketTypeIds,
        quantities,
        totalPriceInWei,
        walletAddress,
        web3
      );

      toast.success(`Thanh toán thành công! Tx: ${tx.transactionHash}`, {
        position: 'top-right',
        autoClose: 5000,
      });
      navigate(`/`);
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      let errorMessage = 'Thanh toán thất bại. Vui lòng kiểm tra dữ liệu và thử lại.';
      if (err.message.includes('execution reverted')) {
        errorMessage = 'Giao dịch bị từ chối do lỗi trong smart contract. Kiểm tra số lượng vé hoặc liên hệ hỗ trợ.';
      } else if (err.message.includes('Số dư ví không đủ')) {
        errorMessage = err.message;
      }
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsPaymentProcessing(false); // Tắt màn hình chờ sau khi hoàn tất hoặc lỗi
    }
  };

  const toggleTicket = (index) => {
    setOpenTicketIndex(openTicketIndex === index ? null : index);
  };

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
    <div className="bg-white dark:bg-black text-white min-h-screen relative">
      {/* Màn hình chờ khi thanh toán */}
      {isPaymentProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
            <p className="text-lg text-white font-semibold">Đang chờ xác nhận thanh toán...</p>
            <p className="text-sm text-gray-300">Vui lòng xác nhận giao dịch trên MetaMask.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="flex flex-col lg:flex-row gap-6">
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
                      {/* {ticket.metadataURI && (
                        <p className="mt-2">
                          <span className="font-medium">Metadata URI:</span>{' '}
                          <a
                            href={ticket.metadataURI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {ticket.metadataURI}
                          </a>
                        </p>
                      )} */}
                    </div>
                  )}

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
              disabled={totalPrice === 0 || isPaymentProcessing}
            >
              {isPaymentProcessing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
            </button>
          </div>
        </div>

        <SpecialEvents events={events} />

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