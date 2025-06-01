import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext'; // Đảm bảo đường dẫn đúng
import Brightness4Icon from '@mui/icons-material/Brightness4'; 

const AdminHeader = ({ walletAddress }) => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-white dark:bg-gray-800 transition-all duration-300 shadow-md p-4 w-full">
  <div className="flex justify-between items-center gap-4 w-full">
    {/* Bên trái */}
    <h1 className="text-2xl font-bold text-black dark:text-white whitespace-nowrap">
      Trang Quản trị
    </h1>

    {/* Bên phải */}
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        <span className="font-medium">Ví: </span>
        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Chưa kết nối'}
      </div>
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-yellow-500 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Brightness4Icon style={{ fontSize: 24 }} />
      </button>
    </div>
  </div>
</header>
  );
};

export default AdminHeader;