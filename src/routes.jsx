import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import EventDetail from './pages/EventDetail';
import Marketplace from './pages/Marketplace';
import PurchasePage from './pages/PurchasePage';
import CustomerInfo from './pages/CustomerInfo';
import HistoryTicket from './pages/HistoryTicket';
import TransferTicket from './pages/TransferTicket';
import MarketplaceTicketManagement from './pages/MarketplaceTicketManagement';
import AdminLayout from './pages/admin/AdminLayout'; // Đảm bảo đường dẫn đúng
import AdminPage from './pages/admin/AdminPage';
import EventManagement from './pages/admin/EventManagement';
import TransactionManagement from './pages/admin/TransactionManagement';
import TicketManagement from './pages/admin/TicketManagement';
import RevenueManagement from './pages/admin/RevenueManagement';
import TicketTypeManagement from './pages/admin/TicketTypeManagement';
import { WalletContext } from './context/WalletContext'; // Đảm bảo đường dẫn đúng
import { useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useState, useEffect } from 'react';
const AdminRoute = ({ children }) => {
  const { walletAddress, connectWallet } = useContext(WalletContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy role từ localStorage hoặc set null
    const savedRole = localStorage.getItem('role');
    setRole(savedRole);
    setLoading(false);
  }, []);

  if (!walletAddress) {
    const handleConnectWallet = async () => {
      const connected = await connectWallet();
      if (!connected) {
        toast.error('Kết nối ví thất bại. Vui lòng thử lại!', {
          position: 'top-center',
          autoClose: 2000,
        });
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center p-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            Vui lòng kết nối ví để truy cập trang Admin
          </h2>
          <button
            onClick={handleConnectWallet}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Kết nối ví
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center p-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Bạn không có quyền truy cập trang Admin
          </h2>
        </div>
      </div>
    );
  }

  // Nếu đã kết nối và role là ADMIN mới cho vào AdminLayout
  return <AdminLayout walletAddress={walletAddress}>{children}</AdminLayout>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'event/:id', element: <EventDetail /> },
      { path: 'market', element: <Marketplace /> },
      { path: '/purchase/:id', element: <PurchasePage /> },
      { path: '/customer-info', element: <CustomerInfo /> },
      { path: '/history-ticket', element: <HistoryTicket /> },
      { path: '/transfer-ticket', element: <TransferTicket /> },
      { path: '/Market-Manager', element: <MarketplaceTicketManagement /> },
      {path: '/search',element: <SearchPage />,},
    ],
  },

  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout>
        </AdminLayout>
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> }, 
       { path: 'events', element: <EventManagement /> },
       { path: 'transaction', element: <TransactionManagement/> },
       { path: 'ticket', element: <TicketManagement/> },
        { path: 'revenue', element: <RevenueManagement/> },
         { path: 'tickettype', element: <TicketTypeManagement/> },
    ],
  },
]);

export default router;