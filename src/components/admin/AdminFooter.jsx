import { ThemeContext } from '../../context/ThemeContext'; // Đảm bảo đường dẫn đúng
const AdminFooter = () => {

  return (
    <footer className="bg-white dark:bg-gray-800 transition-all duration-300 shadow-inner p-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          © 2025 Trang Quản trị. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;