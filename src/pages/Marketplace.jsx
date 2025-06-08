import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Marketplace = () => {
  // Danh sách các sự kiện
  const events = [
    {
      id: 5,
      title: "EDM NIGHT PARTY",
      description: "Đêm tiệc EDM tại District 1 Nightclub, TP.HCM.",
      time: "22:00 - 02:00, ngày 05/07/2025",
      location: "District 1 Nightclub, TP.HCM",
      price: 0.024, // Equivalent to 600,000 VND at 0.00000004 ETH/VND
      image: "https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg",
      link: `/event/5`, // Link đi đến chi tiết sự kiện
    },
    {
      id: 6,
      title: "LOUNGE MUSIC NIGHT",
      description: "Hòa mình vào âm nhạc lounge thư giãn tại Sunset Lounge.",
      time: "20:00 - 00:00, ngày 10/07/2025",
      location: "Sunset Lounge, TP.HCM",
      price: 0.016, // Equivalent to 400,000 VND
      image: "https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg",
      link: `/event/6`, // Link đi đến chi tiết sự kiện
    },
    {
      id: 7,
      title: "JAZZ NIGHT LIVE",
      description: "Nhạc Jazz đêm khuya tại Jazz Club.",
      time: "19:00 - 23:00, ngày 12/07/2025",
      location: "Jazz Club, TP.HCM",
      price: 0.020, // Equivalent to 500,000 VND
      image: "https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg",
      link: `/event/7`, // Link đi đến chi tiết sự kiện
    },
    {
      id: 8,
      title: "ROCK FESTIVAL",
      description: "Rock Festival lớn nhất mùa hè tại Stadium Arena.",
      time: "18:00 - 01:00, ngày 15/07/2025",
      location: "Stadium Arena, TP.HCM",
      price: 0.028, // Equivalent to 700,000 VND
      image: "https://salt.tkbcdn.com/ts/ds/09/d0/56/447ece235bc06c77739ce59d98c820fd.jpg",
      link: `/event/8`, // Link đi đến chi tiết sự kiện
    },
  ];

  // Hàm xử lý khi nhấn "Mua vé"
  const handleBuyTicket = () => {
    alert(`Bạn đã chọn mua vé cho sự kiện. Vui lòng kết nối ví để thanh toán!`);
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tiêu đề trang */}
        <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">Marketplace</h1>

        {/* Section "Dành Cho Bạn" */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hiển thị các sự kiện */}
            {events.map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl overflow-hidden shadow-lg flex flex-col">
                <div className="relative w-full h-48 flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold truncate">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">{event.description.split('.')[0]}</p>
                  {/* Thêm giá vé */}
                  <p className="text-lg font-semibold text-green-500 mt-2">{event.price.toFixed(6)} ETH</p>

                  {/* Nút Mua Vé */}
                  <button
                    onClick={handleBuyTicket}
                    className="mt-2 inline-block bg-green-400 text-white rounded-xl px-4 py-2 hover:bg-green-500 text-sm font-semibold"
                  >
                    Mua Vé
                  </button>

                  {/* Nút Xem Chi Tiết */}
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
        </section>
      </div>
    </div>
  );
};

export default Marketplace;