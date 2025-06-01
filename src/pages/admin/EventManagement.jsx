import { featuredEvents } from '../../data/eventsData';
import React, { useState } from 'react';
import CreateEventDialog from './CreateEventDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState(featuredEvents); // Make events stateful
  const eventsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Get events for the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle dialog open/close
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Callback to handle new event creation
  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: prevEvents.length + 1, // Temporary ID; ideally, use blockchain event ID
        name: newEvent.name, // Sử dụng 'name' thay vì 'title'
        startTime: newEvent.startTime.toLocaleString(), // Format as needed, thay 'time'
        location: newEvent.location,
        ticketTypes: newEvent.ticketTypes.map((ticket) => ({
          name: ticket.name,
          price: Number(ticket.price) / 1e18, // Convert from Wei
          available: ticket.quantity > 0,
          quantity: ticket.quantity,
          benefits: ticket.benefits || [],
          image: ticket.image || '',
        })),
        organizers: [
          {
            id: 0, // Placeholder ID for new event organizer
            logo: "", // Placeholder logo
            name: "Tổ chức mới", // Placeholder name
            description: "Ban tổ chức mới được tạo.", // Placeholder description
          },
        ],
      },
    ]);
    setCurrentPage(1); // Reset to first page to show new event
  };

  // Pagination button class
  const getPageButtonClass = (number) => {
    return `px-3 py-1 mx-1 rounded-md transition-colors ${
      currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'
    }`.trim();
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Quản lý sự kiện
        </h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleOpenDialog}
        >
          Tạo sự kiện
        </button>
      </div>

      {/* Desktop table */}
      <div className="md:block hidden">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">ID</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Tên sự kiện</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Thời gian</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Địa điểm</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ban Tổ Chức</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr key={event.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 text-black dark:text-white">{event.id}</td>
                <td className="px-4 py-2 text-black dark:text-white">{event.name}</td> {/* Thay 'title' bằng 'name' */}
                <td className="px-4 py-2 text-black dark:text-white">{event.startTime}</td> {/* Thay 'time' bằng 'startTime' */}
                <td className="px-4 py-2 text-black dark:text-white">{event.location}</td>
                <td className="px-4 py-2 text-black dark:text-white">{event.organizers[0]?.name || 'Chưa có'}</td>
                <td className="px-4 py-2">
                  {event.ticketTypes.some((ticket) => ticket.available) ? (
                    <span className="text-green-500">Còn vé</span>
                  ) : (
                    <span className="text-red-500">Hết vé</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden block">
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
                <span className="font-semibold text-black dark:text-white w-28">Tiêu đề:</span>
                <span className="text-black dark:text-white">{event.name}</span> {/* Thay 'title' bằng 'name' */}
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Thời gian:</span>
                <span className="text-black dark:text-white">{event.startTime}</span> {/* Thay 'time' bằng 'startTime' */}
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Địa điểm:</span>
                <span className="text-black dark:text-white">{event.location}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Ban Tổ Chức:</span>
                <span className="text-black dark:text-white">{event.organizers[0]?.name || 'Chưa có'}</span>
              </div>
             
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Trạng thái:</span>
                <span className={event.ticketTypes.some((ticket) => ticket.available) ? 'text-green-500' : 'text-red-500'}>
                  {event.ticketTypes.some((ticket) => ticket.available) ? 'Còn vé' : 'Hết vé'}
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

      {/* ToastContainer with customized props */}
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

      {/* CreateEventDialog with onEventCreated callback */}
      <CreateEventDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default EventManagement;