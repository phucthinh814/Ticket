import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpecialEvents from '../components/SpecialEvents';
import { featuredEvents, locations } from '../data/eventsData';
import { WalletContext } from '../context/WalletContext';
import { ThemeContext } from '../context/ThemeContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { isDarkMode } = useContext(ThemeContext);
  const [event, setEvent] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [openTicketIndex, setOpenTicketIndex] = useState(null);
  const { connectWallet, checkConnectionStatus } = useContext(WalletContext);

  // Tải thông tin sự kiện
  useEffect(() => {
    const selectedEvent = featuredEvents.find((e) => e.id === parseInt(id));
    setEvent(selectedEvent);
  }, [id]);

  // Xử lý nhấn nút "Mua vé ngay"
  const handleBuyTicket = async () => {
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
        {/* Hình ảnh + Thông tin sự kiện */}
        <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 rounded-lg overflow-hidden">
              <img src={event.image} alt={event.name} className="w-full h-[400px] object-cover rounded-lg" />
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
              </div>
              <div className="mt-6">
                <button
                  onClick={handleBuyTicket}
                  className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-semibold w-full text-center"
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
            <button onClick={() => setShowDescription(!showDescription)} className="text-gray-700 dark:text-gray-300">
              {showDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          {showDescription && <p className="mt-2 text-gray-700 dark:text-gray-300">{event.description}</p>}
        </div>

        {/* Thông tin vé */}
        <div className="mt-8 bg-gray-900 dark:bg-gray-800 text-white p-6 rounded-xl shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-semibold">Thông tin vé</h3>
            <button
              onClick={handleBuyTicket}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Mua vé ngay
            </button>
          </div>
          <p className="text-sm text-gray-300 dark:text-gray-200 mb-4 flex items-center gap-2">
            <CalendarTodayIcon fontSize="small" /> {formatTimeRange()}
          </p>

          {event.ticketTypes.map((ticket, index) => (
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
                    {ticket.available ? 'Còn vé' : 'Hết vé'}
                  </span>
                </div>
              </div>

              {openTicketIndex === index && (
                <div className="mt-4 bg-gray-800 dark:bg-gray-700 p-4 rounded text-sm text-gray-300 dark:text-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    {ticket.image && (
                      <div className="md:w-1/3 w-full">
                        <img src={ticket.image} alt={ticket.name} className="rounded shadow w-full object-cover" />
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
              <div key={index} className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-lg h-[350px] relative">
                <div className="relative w-full h-full">
                  <img
                    src={location.image}
                    alt={location.title}
                    className="w-full h-full object-cover rounded-2xl"
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