import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { transferTicket } from '../utils/Transfer';

const TransferTicket = () => {
  const { walletAddress } = useContext(WalletContext);
  // const { isDarkMode } = useContext(ThemeContext);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientAddress || !tokenId) {
      toast.error('Vui lòng nhập địa chỉ nhận và ID vé.', {
        position: 'top-center',
        autoClose: 2000,
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirmTransfer = async () => {
    setIsDialogOpen(false);
    setIsLoading(true);
    try {
      await transferTicket(walletAddress, recipientAddress, tokenId);
      toast.success('Chuyển nhượng thành công!', {
        position: 'top-center',
        autoClose: 2000,
      });
      setRecipientAddress('');
      setTokenId('');
    } catch (error) {
      toast.error('Chuyển nhượng thất bại: ' + error.message, {
        position: 'top-center',
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTransfer = () => {
    toast.info('Chuyển nhượng đã bị hủy.', {
      position: 'top-center',
      autoClose: 2000,
    });
    setIsDialogOpen(false);
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Vé</label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Nhập ID vé"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
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
                Bạn có muốn chuyển nhượng vé với ID "{tokenId}" cho địa chỉ "{recipientAddress}" không?
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

        {/* Màn hình chờ giao dịch */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div>
              <p className="text-lg text-white font-semibold">Đang chờ xác nhận thanh toán...</p>
              <p className="text-sm text-gray-300">Vui lòng xác nhận giao dịch trên MetaMask.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferTicket;