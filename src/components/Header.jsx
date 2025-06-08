import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/logo.png';
import logoDarkMode from '../assets/logo_darkmode.png';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon cho dark mode
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { WalletContext } from '../context/WalletContext';
import { ThemeContext } from '../context/ThemeContext'; // Đường dẫn tới ThemeContext

const Header = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const { isConnected, walletAddress, balance, connectWallet, disconnectWallet, shortenAddress } =
    useContext(WalletContext);
 const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  // Danh sách từ khóa gợi ý
  const suggestions = [
    'Nhạc sống Hà Nội',
    'Vé concert BlackPink',
    'Sân khấu kịch',
    'Trận bóng đá Việt Nam',
    'Sự kiện triển lãm nghệ thuật',
  ];

  // Lọc gợi ý dựa trên từ khóa tìm kiếm
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle menu hamburger
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.wallet-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="text-black bg-white dark:bg-black dark:text-white ">
      {/* Header Top */}
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
           <Link to="/">
              <img
                src={isDarkMode ? logoDarkMode : logo}
                alt="NFTTicket Logo"
                className="h-20 w-auto object-contain sm:h-16 md:h-24 lg:h-28"
              />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Thanh tìm kiếm trên desktop, icon trên mobile */}
              <div className="flex items-center">
                <div className="hidden md:flex relative">
                  <Link to="/search">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <SearchIcon style={{ fontSize: 20 }} />
                    </span>
                  </Link>
                  <input
                    type="text"
                    placeholder="Bạn tìm gì hôm nay?"
                    className="pl-10 pr-4 py-2 rounded-l-md text-black dark:text-white w-48 sm:w-56 md:w-64 focus:outline-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  />
                  {isFocused && filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-48 sm:w-56 md:w-64 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md shadow-lg z-30"
                    >
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                          onMouseDown={() => {
                            setSearchTerm(suggestion);
                            setIsFocused(false);
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </motion.div>
                  )}
                  <button className="bg-white text-black dark:text-black border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-300 font-semibold text-sm md:px-4">
                    Tìm kiếm
                  </button>
                </div>
                <Link to="/search">
                  <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-green-500 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <SearchIcon style={{ fontSize: 24 }} />
                  </button>
                </Link>
              </div>
               {/* Nút toggle dark mode */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-yellow-500 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Brightness4Icon style={{ fontSize: 24 }} />
              </button>
              {/* Nút menu hamburger */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-green-500 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <CloseIcon style={{ fontSize: 24 }} /> : <MenuIcon style={{ fontSize: 24 }} />}
              </button>
              {/* Nút kết nối ví và dropdown */}
              <div className="relative wallet-dropdown">
                <button
                  onClick={() => (isConnected ? setShowDropdown(!showDropdown) : connectWallet())}
                  className="flex items-center border border-gray-300 dark:border-gray-600 space-x-1 bg-green-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-green-500 font-semibold text-sm md:px-4 md:py-2"
                >
                  <span>{isConnected ? shortenAddress(walletAddress) : 'Kết Nối Ví'}</span>
                </button>
                {showDropdown && isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-1 sm:right-2 mt-2 w-48 sm:w-56 md:w-64 min-w-[160px] bg-white dark:bg-gray-800 text-black dark:text-white rounded-md shadow-lg z-50"
                  >
                    <div className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                      <AccountBalanceWalletIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                      Số dư: {isBalanceVisible ? `${parseFloat(balance).toFixed(4)} ETH` : '******* ETH'}
                      <button
                        onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                        className="ml-2 focus:outline-none"
                      >
                        {isBalanceVisible ? (
                          <VisibilityOffIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                        ) : (
                          <VisibilityIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                    </div>
                    <Link to="/customer-info" onClick={() => setShowDropdown(false)}>
                      <div className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2">
                        <PersonIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                        Thông tin khách hàng
                      </div>
                    </Link>
                     <Link to="/Market-Manager" onClick={() => setShowDropdown(false)}>
                      <div className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2">
                        <StorefrontIcon  fontSize="small" className="text-gray-600 dark:text-gray-300" />
                        Quản Lý Marketplace
                      </div>
                    </Link>
                    <Link to="/history-ticket" onClick={() => setShowDropdown(false)}>
                      <div className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2">
                        <HistoryIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                        Lịch sử mua vé
                      </div>
                    </Link>
                    <Link to="/transfer-ticket" onClick={() => setShowDropdown(false)}>
                      <div className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2">
                        <SwapHorizIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                        Chuyển nhượng vé
                      </div>
                    </Link>
                    <div
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2"
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                        toast.success('Đã sao chép địa chỉ ví!', {
                          position: 'top-right',
                          autoClose: 2000,
                        });
                        setShowDropdown(false);
                      }}
                    >
                      <ContentCopyIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                      Sao chép Wallet Address
                    </div>
                    <div
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2"
                      onClick={() => {
                        window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, '_blank');
                        setShowDropdown(false);
                      }}
                    >
                      <VisibilityIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                      Xem Sepolia Etherscan
                    </div>
                    <div
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2"
                      onClick={() => {
                        disconnectWallet();
                        setShowDropdown(false);
                      }}
                    >
                      <LogoutIcon fontSize="small" className="text-gray-600 dark:text-gray-300" />
                      Hủy kết nối ví
                    </div>
                  </motion.div>
                )}
              </div>
             
            </div>
          </div>
        </div>
      </div>

      {/* Menu điều hướng */}
      <div className="bg-white text-black dark:bg-black dark:text-white p-2">
        {/* Menu trên desktop */}
        <ul className="hidden md:flex border-t border-black dark:border-gray-700 justify-left space-x-8 pl-4 max-w-7xl mx-auto">
          <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">Sự Kiện</li>
          <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">Concert</li>
          <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">
            <Link to="/market">Marketplace</Link>
          </li>
          <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">Khác</li>
        </ul>
        {/* Menu trên mobile (hamburger) */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden flex flex-col items-center bg-white dark:bg-gray-800 border-t border-black dark:border-gray-700 w-full absolute left-0 z-40"
          >
            <ul className="flex flex-col items-center w-full py-4 space-y-4">
              <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">Sự Kiện</li>
              <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">Concert</li>
              <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">
                <Link to="/market" onClick={() => setIsMenuOpen(false)}>
                  Marketplace
                </Link>
              </li>
              <li className="hover:text-green-300 dark:hover:text-green-400 cursor-pointer font-medium">Khác</li>
            </ul>
          </motion.div>
        )}
      </div>
      <ToastContainer />
    </header>
  );
};

export default Header;