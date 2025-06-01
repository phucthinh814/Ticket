import {useState} from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminFooter from '../../components/admin/AdminFooter';
import AdminDashboard from '../../components/admin/AdminDashboard';
const AdminLayout = ({ walletAddress }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      {/* Header */}
      <header className="w-full">
        <AdminHeader walletAddress={walletAddress} />
      </header>

      {/* Main content: Sidebar + Outlet */}
      <div className="flex flex-1">
        <AdminDashboard isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full">
        <AdminFooter />
      </footer>
    </div>
  );
};


export default AdminLayout;
