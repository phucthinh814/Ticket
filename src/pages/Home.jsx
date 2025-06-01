import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpecialEvents from '../components/SpecialEvents';
import { featuredEvents, locations } from '../data/eventsData';
import RecommendedEvents from '../components/RecommendedEvents';
const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);

  console.log('Featured Events:', featuredEvents);
  console.log('Locations:', locations);

  const eventsPerPage = 2;
  const totalPages = Math.ceil(featuredEvents.length / eventsPerPage);

  const startIndex = currentPage * eventsPerPage;
  const currentEvents = featuredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleDotClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white ">
      {/* Sự kiện nổi bật */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Sự kiện nổi bật</h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-xl h-[480px] w-full relative"
              >
                <div className="relative w-full h-full">
                  <img
                    src={event.image || 'https://via.placeholder.com/300x480?text=Fallback+Image'}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', event.image);
                      e.target.src = 'https://via.placeholder.com/300x480?text=Fallback+Image';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-4">
                    <h3 className="text-lg font-semibold truncate">{event.name}</h3>
                    <p className="text-sm line-clamp-2 mt-1">{event.description.split('.')[0]}</p>
                    <Link
                      to={`/event/${event.id}`}
                      className="mt-3 inline-block bg-white dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600"
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
      <SpecialEvents events={featuredEvents} />

      {/* Dành cho bạn */}
      <RecommendedEvents events={featuredEvents} />

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