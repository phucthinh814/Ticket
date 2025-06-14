import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventIcon from '@mui/icons-material/Event'; // Thêm biểu tượng cho trạng thái
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SpecialEvents from '../components/SpecialEvents';
import { featuredEvents, locations } from '../data/eventsData';
import { WalletContext } from '../context/WalletContext';
import { ThemeContext } from '../context/ThemeContext';
import 'easymde/dist/easymde.min.css'; // Import SimpleMDE CSS for consistency

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connectWallet, checkConnectionStatus } = useContext(WalletContext);
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [openTicketIndex, setOpenTicketIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          description: eventData.description,
          image: eventData.imageUrl || 'https://via.placeholder.com/300x480?text=Fallback+Image',
          location: eventData.location,
          startTime: eventData.dateStart,
          endTime: eventData.dateEnd,
          status: eventData.status, // Thêm trường status
          organizers: [
            {
              name: eventData.organizerName,
              logo: eventData.logo || 'https://via.placeholder.com/100x100?text=Organizer+Logo',
              description: 'Ban tổ chức sự kiện âm nhạc và công nghệ hàng đầu.',
            },
          ],
        };

        // Map ticket types
        const mappedTicketTypes = ticketData.map((ticket) => ({
          name: ticket.name,
          price: ticket.price, // Keep price in ETH
          available: ticket.remainingAmount > 0,
          benefits: ticket.benefits || [], // Default to empty array if benefits is null
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

  // Handle "Mua vé ngay" button
  const handleBuyTicket = async () => {
    if (event.status !== 'UPCOMING') {
      toast.error('Sự kiện đã kết thúc hoặc bị hủy, không thể mua vé!', {
        position: 'top-center',
        autoClose: 2000,
      });
      return;
    }

    const isActuallyConnected = await checkConnectionStatus();
    if (!isActuallyConnected) {
      toast.warning('Vui lòng kết nối ví MetaMask để mua vé!', {
        position: 'top-center',
        autoClose: 2000,
      });
      const connected = await connectWallet();
      if (!connected) {
        return;
      }
    }
    navigate(`/purchase/${id}`);
  };

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

  // Format status display
  const formatStatus = () => {
    switch (event?.status) {
      case 'UPCOMING':
        return <span className="text-green-400 font-semibold">Sắp diễn ra</span>;
      case 'COMPLETED':
        return <span className="text-gray-400 font-semibold">Đã kết thúc</span>;
      case 'CANCELLED':
        return <span className="text-red-400 font-semibold">Đã hủy</span>;
      default:
        return <span className="text-gray-400 font-semibold">Không xác định</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center text-black dark:text-white">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center text-black dark:text-white">
        <p>{error || 'Sự kiện không tồn tại.'}</p>
      </div>
    );
  }

  const isBuyButtonDisabled = event.status !== 'UPCOMING';

  return (
    <div className="bg-white dark:bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hình ảnh + Thông tin sự kiện */}
        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 rounded-lg overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-[400px] object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', event.image);
                  e.target.src = 'https://via.placeholder.com/300x480?text=Fallback+Image';
                }}
              />
            </div>
            <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg w-full md:w-1/3">
              <h2 className="text-xl font-bold mb-4 text-white">{event.name}</h2>
              <div className="space-y-2 text-gray-300 dark:text-gray-200">
                <p className="flex items-center gap-2">
                  <CalendarTodayIcon fontSize="small" className="text-green-400" /> {formatTimeRange()}
                </p>
                <p className="flex items-center gap-2">
                  <LocationOnIcon fontSize="small" className="text-green-400" /> {event.location}
                </p>
                <p className="flex items-center gap-2">
                  <EventIcon fontSize="small" className="text-green-400" /> Trạng thái: {formatStatus()}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleBuyTicket}
                  disabled={isBuyButtonDisabled}
                  className={`mt-4 inline-block px-6 py-2 rounded-lg font-semibold w-full text-center ${
                    isBuyButtonDisabled
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Mua vé ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Giới thiệu */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-black dark:text-white">Giới thiệu</h3>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showDescription ? 'max-h-[1000px]' : 'max-h-16'
            }`}
          >
            <div className="mt-2 text-gray-700 dark:text-gray-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.description}</ReactMarkdown>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {showDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
        </div>

        {/* Thông tin vé */}
        <div className="mt-8 bg-gray-900 dark:bg-gray-800 text-white p-6 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-semibold">Thông tin vé</h3>
            <button
              onClick={handleBuyTicket}
              disabled={isBuyButtonDisabled}
              className={`px-4 py-2 rounded font-semibold ${
                isBuyButtonDisabled
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Mua vé ngay
            </button>
          </div>
          <p className="text-sm text-gray-300 dark:text-gray-200 mb-4 flex items-center gap-2">
            <CalendarTodayIcon fontSize="small" /> {formatTimeRange()}
          </p>

          {ticketTypes.map((ticket, index) => (
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
                    {ticket.available ? 'Còn vé' : 'Hết vé'}
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
            </div>
          ))}
        </div>

        {/* Ban tổ chức */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Ban tổ chức</h3>
          {event.organizers.map((organizer, index) => (
            <div key={index} className="flex items-start gap-4 mb-4">
              <img
                src={organizer.logo}
                alt={`${organizer.name} logo`}
                className="w-20 h-20 object-contain rounded"
                onError={(e) => {
                  console.error('Organizer logo failed to load:', organizer.logo);
                  e.target.src = 'https://via.placeholder.com/100x100?text=Organizer+Logo';
                }}
              />
              <div>
                <h4 className="text-md font-medium text-black dark:text-white">{organizer.name}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{organizer.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sự kiện nổi bật */}
        <SpecialEvents events={featuredEvents} />

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

export default EventDetail;