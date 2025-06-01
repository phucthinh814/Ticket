import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventIcon from '@mui/icons-material/Event';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from 'react-router-dom';
const AdminDashboard = ({ isSidebarOpen, toggleSidebar, className }) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } ${className || ''}`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-full text-left text-black dark:text-white font-semibold mb-4 flex items-center gap-2"
        >
          {isSidebarOpen ? (
            <>
              <ChevronLeftIcon />
              {/* <span>Ẩn</span> */}
            </>
          ) : (
            <ChevronRightIcon />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">

            {/* Quản lý sự kiện */}
            <li className="relative group">
              <Link
                to="/admin/events"
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md 
                  hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white 
                  ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <EventIcon />
                {isSidebarOpen && <span>Quản lý sự kiện</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  Quản lý sự kiện
                </span>
              )}
            </li>

            {/* Quản lý giao dịch */}
            <li className="relative group">
               <Link
                to="/admin/transaction"
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md 
                  hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white 
                  ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <SwapHorizIcon />
                {isSidebarOpen && <span>Quản lý giao dịch</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  Quản lý giao dịch
                </span>
              )}
            </li>

            {/* Quản lý vé */}
            <li className="relative group">
            <Link
                to="/admin/ticket"
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md 
                  hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white 
                  ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                 <ConfirmationNumberIcon />
                {isSidebarOpen && <span>Quản lý vé</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  Quản lý vé
                </span>
              )}
            </li>

            {/* Quản lý loại vé */}
            <li className="relative group">
            <Link
                to="/admin/tickettype"
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md 
                  hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white 
                  ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                 <LocalOfferIcon />
                {isSidebarOpen && <span>Quản lý loại vé</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  Quản lý loại vé
                </span>
              )}
            </li>

            {/* Quản lý doanh thu */}
            <li className="relative group">
            <Link
                to="/admin/revenue"
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md 
                  hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white 
                  ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                 <BarChartIcon />
                {isSidebarOpen && <span>Quản lý doanh thu</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  Quản lý doanh thu
                </span>
              )}
            </li>

          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminDashboard;
