import React, { useState } from 'react';
import { transactions } from '../../data/eventsData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Get transactions for the current page
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

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
    return new Date(dateString).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Quản lý giao dịch
        </h2>
      </div>

      {/* Desktop table */}
      <div className="md:block hidden">
        <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">ID</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Tx Hash</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Từ</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Đến</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Sự kiện</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Loại vé</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Giá (VND)</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Ngày giao dịch</th>
              <th className="px-4 py-2 text-left text-black dark:text-white font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.trans_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 text-black dark:text-white">{transaction.trans_id}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatAddress(transaction.tx_hash)}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatAddress(transaction.from_address)}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatAddress(transaction.to_address)}</td>
                <td className="px-4 py-2 text-black dark:text-white">{transaction.event.event_name}</td>
                <td className="px-4 py-2 text-black dark:text-white">{transaction.ticket_type.name}</td>
                <td className="px-4 py-2 text-black dark:text-white">{transaction.order.total_price.toLocaleString('vi-VN')}</td>
                <td className="px-4 py-2 text-black dark:text-white">{formatDate(transaction.transaction_date)}</td>
                <td className="px-4 py-2">
                  <span className={transaction.order.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}>
                    {transaction.order.is_resale ? 'Bán lại' : 'Mua gốc'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden block">
        {currentTransactions.map((transaction) => (
          <div
            key={transaction.trans_id}
            className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-b dark:border-gray-700"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">ID:</span>
                <span className="text-black dark:text-white">{transaction.trans_id}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Tx Hash:</span>
                <span className="text-black dark:text-white">{formatAddress(transaction.tx_hash)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Từ:</span>
                <span className="text-black dark:text-white">{formatAddress(transaction.from_address)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Đến:</span>
                <span className="text-black dark:text-white">{formatAddress(transaction.to_address)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Sự kiện:</span>
                <span className="text-black dark:text-white">{transaction.event.event_name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Loại vé:</span>
                <span className="text-black dark:text-white">{transaction.ticket_type.name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Giá:</span>
                <span className="text-black dark:text-white">{transaction.order.total_price.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Ngày:</span>
                <span className="text-black dark:text-white">{formatDate(transaction.transaction_date)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-black dark:text-white w-28">Trạng thái:</span>
                <span className={transaction.order.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}>
                  {transaction.order.is_resale ? 'Bán lại' : 'Mua gốc'}
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
    </div>
  );
};

export default TransactionManagement;