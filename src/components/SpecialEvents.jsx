import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SpecialEvents = () => {
  const [events, setEvents] = useState([]);
  const eventsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);

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
            title: event.event_name, // Changed 'name' to 'title' to match rendering
            description: event.description,
            image: event.image_url,
            location: event.location,
            date_start: event.date_start,
            date_end: event.date_end,
            status: event.status,
          }))
          .reverse(); // Reverse the array after mapping
        setEvents(mappedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const startIndex = currentPage * eventsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

  return (
    <section className="max-w-7xl text-black dark:text-white mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Sự kiện đặc biệt</h2>
      <div className="relative">
        {/* Navigation buttons on the sides */}
        {totalPages > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-md disabled:opacity-50 z-10 text-black dark:text-white"
            >
              <ArrowBackIos fontSize="small" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-md disabled:opacity-50 z-10 text-black dark:text-white"
            >
              <ArrowForwardIos fontSize="small" />
            </button>
          </>
        )}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {currentEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-t-2xl overflow-hidden shadow-lg flex flex-col h-[350px]"
                >
                  <div className="relative w-full h-48 flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title} // Changed 'name' to 'title' to match mapping
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold truncate">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
                      {event.description.split('.')[0]}
                    </p>
                    <Link
                      to={`/event/${event.id}`}
                      className="mt-2 inline-block bg-black dark:bg-gray-700 text-white dark:text-white rounded-xl px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-600 text-sm text-center font-semibold"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SpecialEvents;