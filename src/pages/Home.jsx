import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpecialEvents from '../components/SpecialEvents';
import RecommendedEvents from '../components/RecommendedEvents';
import { locations } from '../data/eventsData';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      // Map API data to match expected structure
      const mappedEvents = data
        .map(event => ({
          id: event.event_id,
          name: event.event_name,
          description: event.description,
          image: event.image_url,
          location: event.location,
          date_start: event.date_start,
          date_end: event.date_end,
          status: event.status,
        }))
        .reverse(); // Đảo ngược mảng sau khi map
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

  const eventsPerPage = 2;
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = currentPage * eventsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

  const handleDotClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center text-black dark:text-white">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center text-black dark:text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
     {/* Sự kiện nổi bật */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Sự kiện nổi bật</h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-xl w-full relative h-[300px] md:h-[480px]"
              >
                <div className="relative w-full h-full flex flex-col">
                  <div className="w-full h-[200px] md:h-[380px] overflow-hidden">
                    <img
                      src={event.image || 'https://via.placeholder.com/300x480?text=Fallback+Image'}
                      alt={event.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        console.error('Image failed to load:', event.image);
                        e.target.src = 'https://via.placeholder.com/300x480?text=Fallback+Image';
                      }}
                    />
                  </div>
                  <div className="flex-1 bg-black bg-opacity-60 text-white p-2 md:p-4">
                    <h3 className="text-base md:text-lg font-semibold truncate">{event.name}</h3>
                    <p className="text-xs md:text-sm line-clamp-2 mt-0.5 md:mt-1">{event.description.split('.')[0]}</p>
                    <Link
                      to={`/event/${event.id}`}
                      className="mt-1 md:mt-3 inline-block bg-white dark:bg-gray-700 text-black dark:text-white px-2 md:px-3 py-0.5 md:py-1 rounded-xl text-xs md:text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full ${
                  currentPage === index ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Special Events */}
      <SpecialEvents  />

      {/* Dành cho bạn */}
      <RecommendedEvents events={events} />

      {/* Điểm đến thú vị */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Điểm đến thú vị</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-lg h-[350px] relative"
            >
              <div className="relative w-full h-full">
                <img
                  src={location.image || 'https://via.placeholder.com/300x350?text=Fallback+Image'}
                  alt={location.title}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    console.error('Image failed to load:', location.image);
                    e.target.src = 'https://via.placeholder.com/300x350?text=Fallback+Image';
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full bg-opacity-60 p-4">
                  <h3 className="text-lg font-semibold text-white">{location.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;