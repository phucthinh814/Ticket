import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SearchPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Back Arrow */}
      <div className="p-4">
        <button className="text-blacke" onClick={handleBack}>
          <ArrowForwardIcon style={{ fontSize: 24, transform: 'rotate(180deg)' }} />
        </button>
      </div>

      {/* Search Bar Section */}
      <div className="flex justify-center items-center mb-4">
        <div className="relative w-full max-w-6xl mx-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SearchIcon style={{ fontSize: 20 }} />
          </span>
          <input
            type="text"
            placeholder="Nhập từ khóa"
            className="pl-10 pr-4 py-2 rounded-md text-black w-full focus:outline-none border border-gray-300"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex justify-center items-center mb-4">
        <div className="flex space-x-4 max-w-6xl mx-4 w-full">
          <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-md">
            <CalendarTodayIcon style={{ fontSize: 20 }} />
            <span>Tất cả các ngày</span>
            <span>▼</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-md">
            <FilterListIcon style={{ fontSize: 20 }} />
            <span>Bộ lọc</span>
            <span>▼</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;