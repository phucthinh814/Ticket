import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ticketsPerPage = 10;

  // Fetch tickets from API
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/ticket`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu vé.');
      }

      const data = await response.json();
      setTickets(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      toast.error('Lỗi khi lấy dữ liệu vé: ' + err.message, {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets when component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  // Get tickets for the current page
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

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

  // Pagination button class
  const getPageButtonClass = (number) => {
    return `px-3 py-1 mx-1 rounded-md transition-colors ${
      currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'
    }`.trim();
  };

  // Format address for display (truncate middle)
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format status for display
  const formatStatus = (status) => {
    return status === 'OWNED' ? 'Chưa sử dụng' : 'Đã sử dụng';
  };

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">Quản lý vé</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Đang tải...</p>
      ) : error ? (
        <p className="text-center text-red-500">Lỗi: {error}</p>
      ) : tickets.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Không có vé nào.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="md:block hidden">
            <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">ID</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Sự kiện</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Loại vé</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Giá </th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ngày mua</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Địa điểm</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ngày sự kiện</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ví</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Token ID</th>
                  <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 text-black dark:text-white">{ticket.ticketId}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{ticket.eventName}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{ticket.ticketName}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{ticket.price} ETH </td>
                    <td className="px-4 py-2 text-black dark:text-white">{formatDate(ticket.purchaseDate)}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{ticket.location}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{formatDate(ticket.eventDate)}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{formatAddress(ticket.walletAddress)}</td>
                    <td className="px-4 py-2 text-black dark:text-white">{ticket.tokenId}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          ticket.status === 'OWNED'
                            ? 'text-green-500'
                            : ticket.status === 'USED'
                            ? 'text-gray-500'
                            : 'text-yellow-500'
                        }
                      >
                        {formatStatus(ticket.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden block">
            {currentTickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-b dark:border-gray-700"
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">ID:</span>
                    <span className="text-black dark:text-white">{ticket.ticketId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Sự kiện:</span>
                    <span className="text-black dark:text-white">{ticket.eventName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Loại vé:</span>
                    <span className="text-black dark:text-white">{ticket.ticketName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Giá:</span>
                    <span className="text-black dark:text-white">{ticket.price} ETH</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Ngày mua:</span>
                    <span className="text-black dark:text-white">{formatDate(ticket.purchaseDate)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Địa điểm:</span>
                    <span className="text-black dark:text-white">{ticket.location}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Ngày sự kiện:</span>
                    <span className="text-black dark:text-white">{formatDate(ticket.eventDate)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Ví:</span>
                    <span className="text-black dark:text-white">{formatAddress(ticket.walletAddress)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Token ID:</span>
                    <span className="text-black dark:text-white">{ticket.tokenId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-black dark:text-white w-28">Trạng thái:</span>
                    <span
                      className={
                        ticket.status === 'OWNED'
                          ? 'text-green-500'
                          : ticket.status === 'USED'
                          ? 'text-gray-500'
                          : 'text-yellow-500'
                      }
                    >
                      {formatStatus(ticket.status)}
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
        </>
      )}

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
    </div>
  );
};

export default TicketManagement;