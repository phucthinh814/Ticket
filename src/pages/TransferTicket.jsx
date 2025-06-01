import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext'; // Đảm bảo đường dẫn đúng
import { purchasedTickets } from '../data/eventsData'; // Đảm bảo đường dẫn đúng
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransferTicket = () => {
  //   const { isDarkMode } = useContext(ThemeContext);
  const { walletAddress } = useContext(WalletContext); // Lấy địa chỉ wallet hiện tại
  const [recipientAddress, setRecipientAddress] = useState(''); // Địa chỉ nhận
  const [selectedTicket, setSelectedTicket] = useState(''); // Vé được chọn
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Trạng thái dialog

  // Lọc vé "Chưa sử dụng" thuộc sở hữu của người dùng
  const availableTickets = walletAddress
    ? purchasedTickets.filter(
        (ticket) => ticket.walletAddress === walletAddress && ticket.status === 'Chưa sử dụng'
      )
    : [];

  // Đặt vé đầu tiên làm mặc định khi danh sách thay đổi
  useEffect(() => {
    if (availableTickets.length > 0 && !selectedTicket) {
      setSelectedTicket(availableTickets[0].id);
    }
  }, [availableTickets, selectedTicket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientAddress || !selectedTicket) {
      toast.error('Vui lòng nhập địa chỉ nhận và chọn vé.', {
        position: 'top-center',
        autoClose: 2000,
      });
      return;
    }
    // Mở dialog xác nhận
    setIsDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    // Logic chuyển nhượng vé (placeholder)
    console.log('Chuyển nhượng vé:', {
      sender: walletAddress,
      recipient: recipientAddress,
      ticketId: selectedTicket,
    });
    toast.success('Chuyển nhượng thành công!', {
      position: 'top-center',
      autoClose: 2000,
    });
    setRecipientAddress(''); // Reset form
    setSelectedTicket('');
    setIsDialogOpen(false); // Đóng dialog
  };

  const handleCancelTransfer = () => {
    toast.info('Chuyển nhượng đã bị hủy.', {
      position: 'top-center',
      autoClose: 2000,
    });
    setIsDialogOpen(false); // Đóng dialog
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-black dark:text-white">Chuyển nhượng vé</h2>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ gửi</label>
            <input
              type="text"
              value={walletAddress || 'Chưa kết nối ví'}
              readOnly
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ nhận</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Nhập địa chỉ ví nhận"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vé</label>
            <select
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="" disabled>
                Chọn vé
              </option>
              {availableTickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.eventName} - {ticket.ticketName} 
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Gửi
          </button>
        </form>

        {/* Dialog xác nhận */}
        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Xác nhận chuyển nhượng</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Bạn có muốn chuyển nhượng vé "
                {availableTickets.find((t) => t.id === parseInt(selectedTicket))?.eventName} -{' '}
                {availableTickets.find((t) => t.id === parseInt(selectedTicket))?.ticketName}" cho địa chỉ "
                {recipientAddress}" không?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelTransfer}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmTransfer}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferTicket;