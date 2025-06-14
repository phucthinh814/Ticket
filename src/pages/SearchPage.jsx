import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';

const SearchPage = () => {
  const [allEvents, setAllEvents] = useState([]); // Lưu danh sách sự kiện gốc từ API
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showOrganizerDropdown, setShowOrganizerDropdown] = useState(false);
  const [organizerOptions, setOrganizerOptions] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  // Cập nhật statusOptions để khớp với backend (@JsonValue trả về lowercase)
  const statusOptions = [
    { display: 'Tất cả trạng thái', value: '' },
    { display: 'Sắp diễn ra', value: 'UPCOMING' },
    { display: 'Đã kết thúc', value: 'COMPLETED' },
    { display: 'Đã hủy', value: 'CANCELLED' },
  ];

  // Lấy danh sách tên tổ chức từ API
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/organizers/names');
        setOrganizerOptions(['', ...response.data]);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tổ chức:', error);
        setOrganizerOptions(['', 'Lululola', 'LiveNation', 'Other']);
      }
    };

    fetchOrganizers();
  }, []);

  // Lấy danh sách sự kiện từ API dựa trên keyword
  const fetchEvents = async (keyword = null) => {
    setIsLoading(true);
    try {
      const params = {
        keyword: keyword || null,
      };
      const response = await axios.get('http://localhost:8080/api/events/search', { params });
      setAllEvents(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy sự kiện:', error);
      setAllEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API khi keyword thay đổi
  useEffect(() => {
    const keyword = searchParams.get('keyword') || null;
    fetchEvents(keyword);
  }, [searchParams]);

  // Áp dụng bộ lọc client-side
  useEffect(() => {
    setIsLoading(true);
    try {
      let filtered = [...allEvents];

      // Kiểm tra ngày hợp lệ
      if (dateStart && dateEnd && new Date(dateStart) > new Date(dateEnd)) {
        alert('Ngày bắt đầu không được lớn hơn ngày kết thúc');
        setDateEnd('');
        setFilteredEvents([]);
        return;
      }

      // Bộ lọc ngày
      if (dateStart && dateEnd) {
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.dateStart);
          return eventDate >= new Date(dateStart) && eventDate <= new Date(dateEnd);
        });
      } else if (dateStart) {
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.dateStart);
          return eventDate >= new Date(dateStart);
        });
      } else if (dateEnd) {
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.dateStart);
          return eventDate <= new Date(dateEnd);
        });
      }

      // Bộ lọc trạng thái
      if (statusFilter) {
        filtered = filtered.filter((event) => event.status === statusFilter);
      }

      // Bộ lọc tổ chức
      if (organizerFilter) {
        filtered = filtered.filter((event) => event.organizerName === organizerFilter);
      }

      setFilteredEvents(filtered);
    } catch (error) {
      console.error('Lỗi khi lọc sự kiện:', error);
      setFilteredEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [allEvents, dateStart, dateEnd, statusFilter, organizerFilter]);

  // Format date for display
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  };

  // Cập nhật formatStatus để khớp với backend
  const formatStatus = (status) => {
    switch (status) {
      case 'UPCOMING':
        return <span className="text-green-400 font-semibold">Sắp diễn ra</span>;
      case 'COMPLETED':
        return <span className="text-gray-400 font-semibold">Đã kết thúc</span>;
      case 'CANCELLED':
        return <span className="text-red-400 font-semibold">Đã hủy</span>;
      default:
        return <span className="text-gray-400">Không xác định</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
      {/* Filters Section */}
      <div className="flex items-center mb-4">
        <div className="ml-auto mr-[120px] w-full max-w-6xl flex justify-end space-x-3">
          {/* Date Start Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Từ ngày</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md"
            />
          </div>
          {/* Date End Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đến ngày</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              disabled={!dateStart}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md"
            />
          </div>
          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trạng thái</label>
            <div className="relative">
              <button
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <FilterListIcon style={{ fontSize: 20 }} />
                <span>
                  {statusOptions.find((opt) => opt.value === statusFilter)?.display || 'Trạng thái'}
                </span>
                <span>▼</span>
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.display}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Organizer Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ban tổ chức</label>
            <div className="relative">
              <button
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md"
                onClick={() => setShowOrganizerDropdown(!showOrganizerDropdown)}
              >
                <FilterListIcon style={{ fontSize: 20 }} />
                <span>{organizerFilter || 'Ban tổ chức'}</span>
                <span>▼</span>
              </button>
              {showOrganizerDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
                  {organizerOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setOrganizerFilter(option);
                        setShowOrganizerDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {option || 'Tất cả ban tổ chức'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Listings */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.eventId}
                className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
              >
                <div className="relative w-full h-48 flex-shrink-0">
                  <img
                    src={event.imageUrl || 'https://via.placeholder.com/150'}
                    alt={event.eventName}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold truncate">{event.eventName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {formatDate(event.dateStart)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {event.location}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    Trạng thái: {formatStatus(event.status)}
                  </p>
                  <Link
                    to={`/event/${event.eventId}`}
                    className="mt-3 inline-block bg-white dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600"
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