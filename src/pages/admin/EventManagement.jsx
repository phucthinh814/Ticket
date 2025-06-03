import React, { useState, useEffect } from 'react';
import CreateEventDialog from './CreateEventDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eventsPerPage = 10;

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Map API data to the required structure
        const mappedEvents = data.map((event) => ({
          id: event.event_id,
          name: event.event_name,
          startTime: event.date_start,
          location: event.location,
          description: event.description,
          status: event.status,
          image_url: event.image_url,
        }));
        setEvents(mappedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Get events for the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Handle page navigation
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Generate page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handle dialog
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  // Handle new event creation
  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: prevEvents.length + 1,
        name: newEvent.event.name,
        startTime: newEvent.event.dateStart,
        location: newEvent.event.location,
        description: newEvent.event.description || 'No description',
        status: 'UPCOMING',
        image_url: newEvent.event.image_url || 'https://example.com/default.jpg',
      },
    ]);
    setCurrentPage(1);
  };

  // Shorten description
  const shortenDescription = (description) => {
    return description.length > 50 ? `${description.slice(0, 50)}...` : description;
  };

  // Pagination button class
  const getPageButtonClass = (number) =>
    `px-3 py-1 mx-1 rounded-md transition-colors ${
      currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'
    }`.trim();

  if (loading) {
    return <div className="p-6 text-center text-black dark:text-white">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">Quản lý sự kiện</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleOpenDialog}
        >
          Tạo sự kiện
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">ID</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Tên sự kiện</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Thời gian</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Địa điểm</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Mô tả</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr
                key={event.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 text-black dark:text-white">{event.id}</td>
                <td className="px-4 py-2 text-black dark:text-white">{event.name}</td>
                <td className="px-4 py-2 text-black dark:text-white">
                  {new Date(event.startTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-black dark:text-white">{event.location}</td>
                <td className="px-4 py-2 text-black dark:text-white">
                  {shortenDescription(event.description)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={event.status === 'UPCOMING' ? 'text-green-500' : 'text-red-500'}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile layout */}
      <div className="block md:hidden">
        {currentEvents.map((event) => (
          <div
            key={event.id}
            className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-b dark:border-gray-700"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">ID:</span>
                <span className="text-black dark:text-white">{event.id}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Tên sự kiện:</span>
                <span className="text-black dark:text-white">{event.name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Thời gian:</span>
                <span className="text-black dark:text-white">
                  {new Date(event.startTime).toLocaleString()}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Địa điểm:</span>
                <span className="text-black dark:text-white">{event.location}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Mô tả:</span>
                <span className="text-black dark:text-white">
                  {shortenDescription(event.description)}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Trạng thái:</span>
                <span
                  className={event.status === 'UPCOMING' ? 'text-green-500' : 'text-red-500'}
                >
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6">
        <button
          onClick={handlePreviousPage}
          className="p-2 mx-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={getPageButtonClass(number)}
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          className="p-2 mx-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <ArrowForwardIcon fontSize="small" />
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <CreateEventDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default EventManagement;