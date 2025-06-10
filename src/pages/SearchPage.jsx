import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SearchPage = () => {

  const [dateFilter, setDateFilter] = useState('Tất cả các ngày');
  const [categoryFilter, setCategoryFilter] = useState('Bộ lọc');

  const dateOptions = ['Tất cả các ngày', 'Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'];
  const categoryOptions = ['Bộ lọc', 'Âm nhạc', 'Thể thao', 'Hội thảo', 'Khác'];
  const events = [
    {
      id: 1,
      title: 'ANH TRAI "SAY HI" CONCERT - ĐÊM 6',
      price: '0.01',
      date: '10 tháng 05, 2025',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${1}`, // Link to event detail
    },
    {
      id: 2,
      title: 'ANH TRAI "SAY HI" HÀ NỘI - CONCERT 3',
      price: '0.01',
      date: '07 tháng 12, 2024',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${2}`, // Link to event detail
    },
    {
      id: 3,
      title: 'ANH TRAI "SAY HI" CONCERT - ĐÊM 5',
      price: '0.01',
      date: '21 tháng 03, 2025',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${3}`, // Link to event detail
    },
    {
      id: 4,
      title: 'ANH TRAI "SAY HI" HÀ NỘI - CONCERT 4',
      price: '0.01',
      date: '09 tháng 12, 2024',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${4}`, // Link to event detail
    },
    {
      id: 5,
      title: 'SAY HI THÁNG 7 CỬU VÂN PHÚC WATER SHOW',
      price: '0.01',
      date: '27 tháng 07, 2024',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${5}`, // Link to event detail
    },
    {
      id: 6,
      title: 'AFTER-PARTY: 1900 SAY HELLO | SATURDAY 10:05.2025',
      price: '0.01',
      date: '10 tháng 05, 2025',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${6}`, // Link to event detail
    },
    {
      id: 7,
      title: 'Automotive Mobility Solutions Conference | CONCERTI ANH TRAI VUỐT NGẠN CHỐNG GAI DAYS, DAY6',
      price: '0.01',
      date: '19 tháng 06, 2025',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${7}`, // Link to event detail
    },
    {
      id: 8,
      title: 'CONCERTI ANH TRAI VUỐT NGẠN CHỐNG GAI DAYS, DAY6',
      price: '0.01',
      date: '14 tháng 06, 2025',
      imageUrl: 'https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg',
      tags: ['Đã diễn ra'],
      link: `/event/${8}`, // Link to event detail
    },
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">

      {/* Filters Section */}
<div className="flex items-center mb-4">
      <div className="ml-auto mr-[120px] w-full max-w-6xl flex justify-end space-x-3">
        <div className="relative">
          <button
            className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md"
            onClick={() => setDateFilter(dateFilter === 'Tất cả các ngày' ? 'Hôm nay' : 'Tất cả các ngày')} // Toggle example
          >
            <CalendarTodayIcon style={{ fontSize: 20 }} />
            <span>{dateFilter}</span>
            <span>▼</span>
          </button>
          {dateFilter !== 'Tất cả các ngày' && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setDateFilter(option)}
                  className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md"
            onClick={() => setCategoryFilter(categoryFilter === 'Bộ lọc' ? 'Âm nhạc' : 'Bộ lọc')} // Toggle example
          >
            <FilterListIcon style={{ fontSize: 20 }} />
            <span>{categoryFilter}</span>
            <span>▼</span>
          </button>
          {categoryFilter !== 'Bộ lọc' && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setCategoryFilter(option)}
                  className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
<section className="max-w-7xl mx-auto px-4 py-8">
  {/* Event Listings */}
  {events.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
        >
          <div className="relative w-full h-48 flex-shrink-0">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold truncate">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">{event.date}</p>
            <p className="text-lg font-semibold text-green-500 dark:text-green-400 mt-2">{event.price} ETH</p>
            <span className="inline-block bg-orange-500 text-xs px-2 py-1 rounded-full text-white">{event.tags}</span>
            <Link
              to={event.link}
              className="mt-2 inline-block bg-black dark:bg-gray-700 text-white rounded-xl px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-600 text-sm text-center font-semibold"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-10 text-black dark:text-white">
      <p className="text-xl font-semibold">Không tìm thấy sự kiện</p>
    </div>
  )}
</section>
    </div>
  );
};

export default SearchPage;